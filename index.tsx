import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "jsr:@supabase/supabase-js@2";

// DYlan did this - Supabase backend configuration
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-d598bb36/health", (c) => {
  return c.json({ status: "ok" });
});

// Sign up endpoint
app.post("/make-server-d598bb36/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    // Validate inputs
    if (!email || !password || !name) {
      return c.json({ error: "Email, password, and name are required" }, 400);
    }

    // Create Supabase admin client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log('Sign up error while creating user:', error);
      return c.json({ error: error.message }, 400);
    }

    console.log('User created successfully:', data.user.id);

    return c.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata.name
      }
    });

  } catch (err) {
    console.log('Sign up error in catch block:', err);
    return c.json({
      error: err instanceof Error ? err.message : 'Internal server error'
    }, 500);
  }
});

// Login endpoint
app.post("/make-server-d598bb36/login", async (c) => {
  try {
    const { email, password } = await c.req.json();

    // Validate inputs
    if (!email || !password) {
      return c.json({ error: "Email and password are required" }, 400);
    }

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    // Sign in with password
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log('Login error during sign in:', error);
      return c.json({ error: error.message }, 401);
    }

    console.log('User logged in successfully:', data.user.id);

    return c.json({
      success: true,
      access_token: data.session.access_token,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name
      }
    });

  } catch (err) {
    console.log('Login error in catch block:', err);
    return c.json({
      error: err instanceof Error ? err.message : 'Internal server error'
    }, 500);
  }
});

// User preferences endpoints
app.post("/make-server-d598bb36/preferences/food", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
   
    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
   
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const preferences = await c.req.json();
    await kv.set(`food_preferences_${user.id}`, preferences);

    return c.json({ success: true });
  } catch (err) {
    console.log('Error saving food preferences:', err);
    return c.json({ error: 'Failed to save preferences' }, 500);
  }
});

app.get("/make-server-d598bb36/preferences/food", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
   
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
   
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const preferences = await kv.get(`food_preferences_${user.id}`);

    return c.json({ success: true, preferences: preferences || {} });
  } catch (err) {
    console.log('Error getting food preferences:', err);
    return c.json({ error: 'Failed to get preferences' }, 500);
  }
});

app.post("/make-server-d598bb36/preferences/location", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
   
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
   
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const preferences = await c.req.json();
    await kv.set(`location_preferences_${user.id}`, preferences);

    return c.json({ success: true });
  } catch (err) {
    console.log('Error saving location preferences:', err);
    return c.json({ error: 'Failed to save preferences' }, 500);
  }
});

app.post("/make-server-d598bb36/preferences/notifications", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
   
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
   
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const preferences = await c.req.json();
    await kv.set(`notification_preferences_${user.id}`, preferences);

    return c.json({ success: true });
  } catch (err) {
    console.log('Error saving notification preferences:', err);
    return c.json({ error: 'Failed to save preferences' }, 500);
  }
});

app.post("/make-server-d598bb36/saved-places", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
   
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
   
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { locationId } = await c.req.json();
   
    // Get existing saved places
    const savedPlaces = (await kv.get(`saved_places_${user.id}`)) || [];
   
    // Toggle saved place
    const index = savedPlaces.indexOf(locationId);
    if (index > -1) {
      savedPlaces.splice(index, 1);
    } else {
      savedPlaces.push(locationId);
    }
   
    await kv.set(`saved_places_${user.id}`, savedPlaces);

    return c.json({ success: true, savedPlaces });
  } catch (err) {
    console.log('Error saving place:', err);
    return c.json({ error: 'Failed to save place' }, 500);
  }
});

app.get("/make-server-d598bb36/saved-places", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
   
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
   
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const savedPlaces = (await kv.get(`saved_places_${user.id}`)) || [];

    return c.json({ success: true, savedPlaces });
  } catch (err) {
    console.log('Error getting saved places:', err);
    return c.json({ error: 'Failed to get saved places' }, 500);
  }
});

// Get daily recipes endpoint
app.get("/make-server-d598bb36/recipes/daily", async (c) => {
  try {
    // DYlan did this - Claude API Key configuration
    const claudeApiKey = Deno.env.get('CLAUDE_API_KEY');
    console.log('Daily recipes - Claude API key exists:', !!claudeApiKey);
   
    if (!claudeApiKey) {
      return c.json({ error: 'Claude API key not configured' }, 500);
    }

    const today = new Date().toISOString().split('T')[0];
    console.log('Generating recipes for:', today);

    // Simple prompt
    const prompt = `Generate 3 simple recipes (breakfast, lunch, dinner) using common food bank ingredients like rice, beans, pasta, eggs, bread. Return only valid JSON in this exact format:
{
  "breakfast": {"name": "Recipe Name", "description": "Brief description", "ingredients": ["ingredient 1", "ingredient 2"], "prepTime": "15 min"},
  "lunch": {"name": "Recipe Name", "description": "Brief description", "ingredients": ["ingredient 1", "ingredient 2"], "prepTime": "20 min"},
  "dinner": {"name": "Recipe Name", "description": "Brief description", "ingredients": ["ingredient 1", "ingredient 2"], "prepTime": "30 min"}
}`;

    console.log('Calling Claude API...');
    const response = await fetch(
      'https://api.anthropic.com/v1/messages',
      {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-api-key': claudeApiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1024,
          messages: [{
            role: 'user',
            content: prompt
          }]
        })
      }
    );

    console.log('Claude API status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('Claude API error response:', errorText);
      return c.json({ error: `Claude API error: ${response.status}`, details: errorText }, 500);
    }

    const data = await response.json();
    console.log('Claude API success');
    
    let text = data.content[0].text;
    
    // Clean markdown if present
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const recipes = JSON.parse(text);
    console.log('Recipes parsed successfully');

    return c.json({ success: true, recipes });

  } catch (err) {
    console.log('Daily recipes error:', err);
    return c.json({ 
      error: err instanceof Error ? err.message : 'Failed to generate recipes',
      details: err instanceof Error ? err.stack : undefined
    }, 500);
  }
});

// Analyze food image and generate recipes
app.post("/make-server-d598bb36/recipes/analyze-image", async (c) => {
  try {
    const { image } = await c.req.json();
    console.log('Image analysis - Image received:', !!image);

    if (!image) {
      return c.json({ error: 'No image provided' }, 400);
    }

    // DYlan did this - Moderate image with Sightengine before processing
    const sightengineUser = Deno.env.get('SIGHTENGINE_API_USER');
    const sightengineSecret = Deno.env.get('SIGHTENGINE_API_SECRET');
    
    if (!sightengineUser || !sightengineSecret) {
      console.log('Sightengine credentials not configured, skipping moderation');
    } else {
      console.log('Moderating image with Sightengine...');
      
      // Extract base64 data for moderation
      const base64Data = image.includes('base64,') ? image.split('base64,')[1] : image;
      
      // Call Sightengine moderation API
      const moderationUrl = `https://api.sightengine.com/1.0/check.json`;
      const formData = new FormData();
      formData.append('api_user', sightengineUser);
      formData.append('api_secret', sightengineSecret);
      formData.append('models', 'nudity-2.0,wad,offensive,text-content');
      formData.append('media', `data:image/jpeg;base64,${base64Data}`);
      
      const moderationResponse = await fetch(moderationUrl, {
        method: 'POST',
        body: formData
      });
      
      if (moderationResponse.ok) {
        const moderationData = await moderationResponse.json();
        console.log('Moderation result:', moderationData);
        
        // Check for inappropriate content
        const nudityScore = moderationData.nudity?.sexual || 0;
        const weaponScore = moderationData.weapon || 0;
        const alcoholScore = moderationData.alcohol || 0;
        const drugScore = moderationData.drugs || 0;
        const offensiveScore = moderationData.offensive?.prob || 0;
        
        // Reject image if any inappropriate content detected
        if (nudityScore > 0.5) {
          return c.json({ 
            error: 'Image rejected: Inappropriate content detected',
            moderationReason: 'adult_content' 
          }, 400);
        }
        if (weaponScore > 0.5) {
          return c.json({ 
            error: 'Image rejected: Weapons detected',
            moderationReason: 'weapons' 
          }, 400);
        }
        if (alcoholScore > 0.5 || drugScore > 0.5) {
          return c.json({ 
            error: 'Image rejected: Alcohol or drugs detected',
            moderationReason: 'substances' 
          }, 400);
        }
        if (offensiveScore > 0.5) {
          return c.json({ 
            error: 'Image rejected: Offensive content detected',
            moderationReason: 'offensive' 
          }, 400);
        }
        
        console.log('Image passed moderation checks');
      } else {
        console.log('Moderation API failed, proceeding without moderation');
      }
    }

    const claudeApiKey = Deno.env.get('CLAUDE_API_KEY');
    console.log('Image analysis - Claude API key exists:', !!claudeApiKey);
   
    if (!claudeApiKey) {
      return c.json({ error: 'Claude API key not configured' }, 500);
    }

    // Extract base64 data
    const base64Data = image.includes('base64,') ? image.split('base64,')[1] : image;
    console.log('Image analysis - Base64 data length:', base64Data.length);

    // Determine media type from base64 or default to jpeg
    let mediaType = 'image/jpeg';
    if (image.includes('image/png')) {
      mediaType = 'image/png';
    } else if (image.includes('image/webp')) {
      mediaType = 'image/webp';
    } else if (image.includes('image/gif')) {
      mediaType = 'image/gif';
    }

    // Step 1: Identify ingredients
    console.log('Calling Claude Vision API...');
    const visionResponse = await fetch(
      'https://api.anthropic.com/v1/messages',
      {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-api-key': claudeApiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1024,
          messages: [{
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mediaType,
                  data: base64Data
                }
              },
              {
                type: 'text',
                text: 'Identify all food ingredients in this image. Return only valid JSON in this exact format: {"ingredients": [{"name": "ingredient name", "confidence": "high"}]}'
              }
            ]
          }]
        })
      }
    );

    console.log('Vision API status:', visionResponse.status);

    if (!visionResponse.ok) {
      const errorText = await visionResponse.text();
      console.log('Vision API error:', errorText);
      return c.json({ error: `Vision API error: ${visionResponse.status}`, details: errorText }, 500);
    }

    const visionData = await visionResponse.json();
    console.log('Vision API success');
    
    let text = visionData.content[0].text;
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const ingredientsData = JSON.parse(text);
    const ingredients = ingredientsData.ingredients;
    console.log('Identified ingredients:', ingredients.length);

    if (!ingredients || ingredients.length === 0) {
      return c.json({ error: 'No ingredients identified' }, 400);
    }

    // Step 2: Generate recipes
    const ingredientNames = ingredients.map((ing: { name: string }) => ing.name).join(', ');
    console.log('Generating recipes for:', ingredientNames);

    const recipeResponse = await fetch(
      'https://api.anthropic.com/v1/messages',
      {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-api-key': claudeApiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2048,
          messages: [{
            role: 'user',
            content: `Create 2-3 simple recipes using these ingredients: ${ingredientNames}. You can add common pantry items like rice, beans, pasta, oil, salt, pepper. Return only valid JSON in this exact format:
{
  "recipes": [
    {
      "name": "Recipe Name",
      "description": "Brief description",
      "ingredients": ["ingredient with quantity"],
      "instructions": ["step 1", "step 2"],
      "prepTime": "X min"
    }
  ]
}`
          }]
        })
      }
    );

    console.log('Recipe API status:', recipeResponse.status);

    if (!recipeResponse.ok) {
      const errorText = await recipeResponse.text();
      console.log('Recipe API error:', errorText);
      return c.json({ error: `Recipe API error: ${recipeResponse.status}`, details: errorText }, 500);
    }

    const recipeData = await recipeResponse.json();
    console.log('Recipe API success');
    
    let recipeText = recipeData.content[0].text;
    recipeText = recipeText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const recipesData = JSON.parse(recipeText);
    console.log('Recipes generated:', recipesData.recipes.length);

    return c.json({
      success: true,
      ingredients,
      recipes: recipesData.recipes
    });

  } catch (err) {
    console.log('Image analysis error:', err);
    return c.json({ 
      error: err instanceof Error ? err.message : 'Failed to analyze image',
      details: err instanceof Error ? err.stack : undefined
    }, 500);
  }
});

// DYlan did this - Get nutrition info from USDA FoodData Central
app.post("/make-server-d598bb36/nutrition/search", async (c) => {
  try {
    const usdaApiKey = Deno.env.get('USDA_API_KEY');
    console.log('USDA API key exists:', !!usdaApiKey);
    
    if (!usdaApiKey) {
      return c.json({ error: 'USDA API key not configured' }, 500);
    }

    const { ingredient } = await c.req.json();
    
    if (!ingredient) {
      return c.json({ error: 'No ingredient provided' }, 400);
    }

    console.log('Searching nutrition for:', ingredient);

    // Search for food item
    const searchUrl = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(ingredient)}&pageSize=1&api_key=${usdaApiKey}`;
    
    const response = await fetch(searchUrl);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('USDA API error:', errorText);
      return c.json({ error: 'Failed to fetch nutrition data' }, 500);
    }

    const data = await response.json();
    console.log('USDA API success');
    
    if (!data.foods || data.foods.length === 0) {
      return c.json({ error: 'No nutrition data found' }, 404);
    }

    const food = data.foods[0];
    
    // Get key nutrients
    const nutrients = food.foodNutrients || [];
    const nutritionInfo = {
      name: food.description,
      calories: nutrients.find((n: any) => n.nutrientName === 'Energy')?.value || 0,
      protein: nutrients.find((n: any) => n.nutrientName === 'Protein')?.value || 0,
      carbs: nutrients.find((n: any) => n.nutrientName === 'Carbohydrate, by difference')?.value || 0,
      fat: nutrients.find((n: any) => n.nutrientName === 'Total lipid (fat)')?.value || 0,
      fiber: nutrients.find((n: any) => n.nutrientName === 'Fiber, total dietary')?.value || 0,
    };

    return c.json({ success: true, nutrition: nutritionInfo });

  } catch (err) {
    console.log('Nutrition search error:', err);
    return c.json({ 
      error: err instanceof Error ? err.message : 'Failed to search nutrition',
      details: err instanceof Error ? err.stack : undefined
    }, 500);
  }
});

// DYlan did this - Spoonacular: Search recipes by ingredients
app.post("/make-server-d598bb36/spoonacular/search-by-ingredients", async (c) => {
  try {
    const spoonacularKey = Deno.env.get('SPOONACULAR_API_KEY');
    console.log('Spoonacular API key exists:', !!spoonacularKey);
    
    if (!spoonacularKey) {
      return c.json({ error: 'Spoonacular API key not configured' }, 500);
    }

    const { ingredients, number = 5 } = await c.req.json();
    
    if (!ingredients || ingredients.length === 0) {
      return c.json({ error: 'No ingredients provided' }, 400);
    }

    console.log('Searching recipes for ingredients:', ingredients);

    const ingredientsString = Array.isArray(ingredients) ? ingredients.join(',') : ingredients;
    const searchUrl = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(ingredientsString)}&number=${number}&ranking=2&ignorePantry=false&apiKey=${spoonacularKey}`;
    
    const response = await fetch(searchUrl);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('Spoonacular API error:', errorText);
      return c.json({ error: 'Failed to search recipes' }, 500);
    }

    const recipes = await response.json();
    console.log('Spoonacular API success, found recipes:', recipes.length);

    return c.json({ success: true, recipes });

  } catch (err) {
    console.log('Spoonacular search error:', err);
    return c.json({ 
      error: err instanceof Error ? err.message : 'Failed to search recipes',
      details: err instanceof Error ? err.stack : undefined
    }, 500);
  }
});

// DYlan did this - Spoonacular: Get detailed recipe information
app.get("/make-server-d598bb36/spoonacular/recipe/:id", async (c) => {
  try {
    const spoonacularKey = Deno.env.get('SPOONACULAR_API_KEY');
    
    if (!spoonacularKey) {
      return c.json({ error: 'Spoonacular API key not configured' }, 500);
    }

    const recipeId = c.req.param('id');
    console.log('Getting recipe details for:', recipeId);

    const url = `https://api.spoonacular.com/recipes/${recipeId}/information?includeNutrition=true&apiKey=${spoonacularKey}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('Spoonacular API error:', errorText);
      return c.json({ error: 'Failed to get recipe details' }, 500);
    }

    const recipe = await response.json();
    console.log('Recipe details retrieved successfully');

    return c.json({ success: true, recipe });

  } catch (err) {
    console.log('Spoonacular recipe details error:', err);
    return c.json({ 
      error: err instanceof Error ? err.message : 'Failed to get recipe details',
      details: err instanceof Error ? err.stack : undefined
    }, 500);
  }
});

// DYlan did this - Spoonacular: Get random recipes for meal planning
app.get("/make-server-d598bb36/spoonacular/random", async (c) => {
  try {
    const spoonacularKey = Deno.env.get('SPOONACULAR_API_KEY');
    
    if (!spoonacularKey) {
      return c.json({ error: 'Spoonacular API key not configured' }, 500);
    }

    const number = c.req.query('number') || '3';
    const tags = c.req.query('tags') || 'cheap,easy';
    
    console.log('Getting random recipes with tags:', tags);

    const url = `https://api.spoonacular.com/recipes/random?number=${number}&tags=${tags}&apiKey=${spoonacularKey}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('Spoonacular API error:', errorText);
      return c.json({ error: 'Failed to get random recipes' }, 500);
    }

    const data = await response.json();
    console.log('Random recipes retrieved:', data.recipes?.length);

    return c.json({ success: true, recipes: data.recipes });

  } catch (err) {
    console.log('Spoonacular random recipes error:', err);
    return c.json({ 
      error: err instanceof Error ? err.message : 'Failed to get random recipes',
      details: err instanceof Error ? err.stack : undefined
    }, 500);
  }
});

Deno.serve(app.fetch);