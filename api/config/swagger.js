import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "LaunchPilot API Documentation",
      version: "1.0.0",
      description:
        "AI-powered product launch platform for African markets - Comprehensive API documentation",
      contact: {
        name: "LaunchPilot Team",
        email: "support@launchpilot.com",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: "http://localhost:8000",
        description: "Development server",
      },
      {
        url: "https://api.launchpilot.com",
        description: "Production server",
      },
    ],
    tags: [
      {
        name: "Authentication",
        description: "User authentication and session management",
      },
      { name: "Users", description: "User profile and account management" },
      {
        name: "Launches",
        description: "Product launch creation and management",
      },
      {
        name: "Content Drafts",
        description: "AI-powered content generation and editing",
      },
      { name: "Partners", description: "Partner marketplace and discovery" },
      {
        name: "Tasks",
        description: "Launch task management with real-time updates",
      },
      {
        name: "Launch Pages",
        description: "Public launch pages and email capture",
      },
      {
        name: "Analytics",
        description: "Launch metrics and performance tracking",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "JWT access token obtained from /api/auth/login",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: { type: "string", example: "507f1f77bcf86cd799439011" },
            name: { type: "string", example: "John Doe" },
            email: {
              type: "string",
              format: "email",
              example: "john@example.com",
            },
            role: {
              type: "string",
              enum: ["user", "admin", "partner"],
              example: "user",
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Profile: {
          type: "object",
          properties: {
            _id: { type: "string" },
            userId: { type: "string" },
            businessName: { type: "string", example: "TechStart Lagos" },
            industry: { type: "string", example: "Technology" },
            country: { type: "string", example: "Nigeria" },
            timezone: {
              type: "string",
              enum: ["Africa/Lagos", "Africa/Accra", "Africa/Nairobi"],
              example: "Africa/Lagos",
            },
            preferredCurrency: {
              type: "string",
              enum: ["NGN", "GHS", "USD", "KES", "ZAR", "EGP"],
              example: "NGN",
            },
            avatar: { type: "string", format: "uri" },
            bio: { type: "string" },
          },
        },
        Launch: {
          type: "object",
          properties: {
            _id: { type: "string" },
            userId: { type: "string" },
            productName: { type: "string", example: "EcoTech Mobile App" },
            description: { type: "string" },
            targetMarket: {
              type: "string",
              enum: ["Nigeria", "Ghana", "Kenya", "South Africa", "Egypt"],
              example: "Nigeria",
            },
            launchDate: { type: "string", format: "date-time" },
            budget: {
              type: "integer",
              description:
                "Budget in smallest currency unit (kobo/pesewa/cents)",
              example: 500000,
            },
            currency: {
              type: "string",
              enum: ["NGN", "GHS", "USD", "KES", "ZAR", "EGP"],
              example: "NGN",
            },
            status: {
              type: "string",
              enum: ["draft", "planning", "active", "completed", "archived"],
              example: "planning",
            },
            collaborators: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  userId: { type: "string" },
                  role: {
                    type: "string",
                    enum: ["owner", "admin", "editor", "viewer"],
                  },
                  addedAt: { type: "string", format: "date-time" },
                },
              },
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        LaunchPlan: {
          type: "object",
          properties: {
            _id: { type: "string" },
            launchId: { type: "string" },
            aiProvider: {
              type: "string",
              enum: ["gemini", "openai", "template"],
              example: "gemini",
            },
            plan: {
              type: "object",
              properties: {
                phases: { type: "array", items: { type: "object" } },
                timeline: { type: "object" },
                recommendations: { type: "array", items: { type: "string" } },
              },
            },
            version: { type: "integer", example: 1 },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        ContentDraft: {
          type: "object",
          properties: {
            _id: { type: "string" },
            launchId: { type: "string" },
            userId: { type: "string" },
            contentType: {
              type: "string",
              enum: [
                "social_post",
                "email",
                "blog_post",
                "press_release",
                "landing_page",
              ],
              example: "social_post",
            },
            platform: {
              type: "string",
              enum: [
                "twitter",
                "linkedin",
                "facebook",
                "instagram",
                "email",
                "website",
              ],
              example: "twitter",
            },
            prompt: {
              type: "string",
              example: "Write an exciting launch announcement",
            },
            generatedContent: { type: "string" },
            aiProvider: {
              type: "string",
              enum: ["gemini", "openai", "template"],
              example: "gemini",
            },
            status: {
              type: "string",
              enum: ["draft", "reviewed", "approved", "published"],
              example: "draft",
            },
            version: { type: "integer", example: 1 },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Partner: {
          type: "object",
          properties: {
            _id: { type: "string" },
            userId: { type: "string" },
            businessName: { type: "string", example: "Digital Marketing Pro" },
            services: {
              type: "array",
              items: {
                type: "string",
                enum: [
                  "marketing",
                  "design",
                  "development",
                  "content_writing",
                  "pr",
                  "seo",
                  "social_media",
                  "video_production",
                ],
              },
            },
            description: { type: "string" },
            portfolio: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  url: { type: "string", format: "uri" },
                  imageUrl: { type: "string", format: "uri" },
                },
              },
            },
            pricing: { type: "string", example: "From $500 per project" },
            rating: { type: "number", minimum: 0, maximum: 5, example: 4.5 },
            reviewCount: { type: "integer", example: 23 },
            isVerified: { type: "boolean", example: true },
            availability: {
              type: "string",
              enum: ["available", "busy", "unavailable"],
              example: "available",
            },
          },
        },
        Task: {
          type: "object",
          properties: {
            _id: { type: "string" },
            launchId: { type: "string" },
            title: { type: "string", example: "Design launch banner" },
            description: { type: "string" },
            assignedTo: { type: "string" },
            status: {
              type: "string",
              enum: ["todo", "in_progress", "review", "completed"],
              example: "todo",
            },
            priority: {
              type: "string",
              enum: ["low", "medium", "high", "urgent"],
              example: "high",
            },
            dueDate: { type: "string", format: "date-time" },
            comments: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  userId: { type: "string" },
                  comment: { type: "string" },
                  createdAt: { type: "string", format: "date-time" },
                },
              },
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        LaunchPage: {
          type: "object",
          properties: {
            _id: { type: "string" },
            launchId: { type: "string" },
            slug: { type: "string", example: "ecotech-mobile-app" },
            isPublished: { type: "boolean", example: true },
            customDomain: { type: "string" },
            theme: { type: "string", example: "modern" },
            content: {
              type: "object",
              properties: {
                headline: { type: "string" },
                subheadline: { type: "string" },
                features: { type: "array", items: { type: "object" } },
                media: { type: "array", items: { type: "object" } },
              },
            },
            emailSubscribers: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  email: { type: "string", format: "email" },
                  subscribedAt: { type: "string", format: "date-time" },
                },
              },
            },
          },
        },
        LaunchMetrics: {
          type: "object",
          properties: {
            _id: { type: "string" },
            launchId: { type: "string" },
            date: { type: "string", format: "date" },
            pageViews: { type: "integer", example: 1250 },
            uniqueVisitors: { type: "integer", example: 890 },
            emailSignups: { type: "integer", example: 45 },
            socialShares: { type: "integer", example: 120 },
            conversionRate: { type: "number", example: 3.6 },
            bounceRate: { type: "number", example: 42.5 },
          },
        },
        Error: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Error description" },
            error: { type: "string" },
          },
        },
        Success: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Operation successful" },
            data: { type: "object" },
          },
        },
      },
      responses: {
        UnauthorizedError: {
          description: "Access token is missing or invalid",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Error" },
              example: {
                success: false,
                message: "Not authorized, token missing or invalid",
              },
            },
          },
        },
        ForbiddenError: {
          description: "Insufficient permissions",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Error" },
              example: {
                success: false,
                message: "Access denied. Insufficient permissions.",
              },
            },
          },
        },
        NotFoundError: {
          description: "Resource not found",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Error" },
              example: {
                success: false,
                message: "Resource not found",
              },
            },
          },
        },
        ValidationError: {
          description: "Request validation failed",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Error" },
              example: {
                success: false,
                message: "Validation error",
                error: "Invalid input data",
              },
            },
          },
        },
        ServerError: {
          description: "Internal server error",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Error" },
              example: {
                success: false,
                message: "Server error",
                error: "Something went wrong",
              },
            },
          },
        },
      },
    },
  },
  apis: ["./routes/*.js"], // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
