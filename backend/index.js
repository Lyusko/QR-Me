const express = require("express");
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const cors = require("cors");

// Load environment variables
dotenv.config();

const app = express();
app.use(cors({
  origin: '*', // Allow from all origins, or set specific domains
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
}));
app.use(express.json());

// Create MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the MySQL database.");
});

// Register a new user
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    console.error("Missing input: username, email, or password");
    return res
      .status(400)
      .json({ message: "Please provide username, email, and password." });
  }

  // Simple email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.error("Please enter a valid E-mail!:", email);
    return res.status(400).json({ message: "Please enter a valid E-mail!" });
  }

  try {
    // Check if username or email already exists
    db.query(
      "SELECT * FROM users WHERE username = ? OR email = ?",
      [username, email],
      async (err, results) => {
        if (err) {
          console.error("Error checking user existence in the database:", err);
          return res.status(500).json({ message: "Database query error." });
        }

        if (results.length > 0) {
          console.warn("User already exists:", username, email);
          return res.status(400).json({ message: "User already exists!" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into the database
        db.query(
          "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
          [username, email, hashedPassword],
          (err, results) => {
            if (err) {
              console.error("Error inserting user into the database:", err);
              return res
                .status(500)
                .json({ message: "Database insertion error." });
            }

            console.log("User registered successfully:", {
              id: results.insertId,
              username,
              email,
            });
            res.status(201).json({ message: "User registered successfully." });
          }
        );
      }
    );
  } catch (error) {
    console.error("Unexpected error during registration process:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// Login a user
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide both email and password." });
  }

  // Check if user exists by email
  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err || results.length === 0) {
        return res.status(401).json({ message: "Invalid credentials." });
      }

      const user = results[0];

      // Compare password with hashed password
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials." });
      }

      // Generate a JWT with the user id and username
      const token = jwt.sign(
        { id: user.id, username: user.username, theme: user.theme },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRES_IN,
        }
      );

      res.json({ message: "Logged in successfully.", token, theme: user.theme });
    }
  );
});

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Split the "Bearer " part from the token

  if (!token) {
    return res.status(401).json({ message: "Access token required." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token." });
    }

    req.user = user; // Store the user object (decoded token payload) in the request
    next();
  });
};

// Protected route example
app.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "This is a protected route.", user: req.user });
});

// Static QR Codes Routes

// Create a static QR code
app.post("/api/static-qrcodes", authenticateToken, (req, res) => {
  const { url } = req.body;
  const userId = req.user.id; // Get the authenticated user's ID from the token

  db.query(
    "INSERT INTO static_qrcodes (url, user_id) VALUES (?, ?)",
    [url, userId],
    (err, results) => {
      if (err) throw err;
      res.json({ id: results.insertId, url });
    }
  );
});

// Get all static QR codes
app.get("/api/static-qrcodes", authenticateToken, (req, res) => {
  const userId = req.user.id; // Get the authenticated user's ID from the token

  db.query(
    "SELECT * FROM static_qrcodes WHERE user_id = ?",
    [userId],
    (err, results) => {
      if (err) throw err;
      res.json(results);
    }
  );
});

// Update a static QR code
app.put("/api/static-qrcodes/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const { url } = req.body;
  const userId = req.user.id; // Get the authenticated user's ID from the token

  // Verify ownership before updating
  db.query(
    "SELECT * FROM static_qrcodes WHERE id = ? AND user_id = ?",
    [id, userId],
    (err, results) => {
      if (err) throw err;
      if (results.length === 0) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      db.query(
        "UPDATE static_qrcodes SET url = ? WHERE id = ?",
        [url, id],
        (err) => {
          if (err) throw err;
          res.json({ id, url });
        }
      );
    }
  );
});

// Delete a static QR code
app.delete("/api/static-qrcodes/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const userId = req.user.id; // Get the authenticated user's ID from the token

  // Verify ownership before deleting
  db.query(
    "SELECT * FROM static_qrcodes WHERE id = ? AND user_id = ?",
    [id, userId],
    (err, results) => {
      if (err) throw err;
      if (results.length === 0) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      db.query("DELETE FROM static_qrcodes WHERE id = ?", [id], (err) => {
        if (err) throw err;
        res.status(204).send();
      });
    }
  );
});

// Dynamic QR Codes Routes

// Create a dynamic QR code
app.post("/api/dynamic-qrcodes", authenticateToken, (req, res) => {
  const { redirect_url, qr_code_id } = req.body;
  const userId = req.user.id; // Get the authenticated user's ID from the token

  db.query(
    "INSERT INTO dynamic_qrcodes (redirect_url, qr_code_id, user_id) VALUES (?, ?, ?)",
    [redirect_url, qr_code_id || null, userId],
    (err, results) => {
      if (err) {
        console.error("Error inserting dynamic QR code:", err);
        return res
          .status(500)
          .json({ error: "Error inserting dynamic QR code" });
      }
      res.json({ id: results.insertId, redirect_url, qr_code_id });
    }
  );
});

// Get all dynamic QR codes
app.get("/api/dynamic-qrcodes", authenticateToken, (req, res) => {
  const userId = req.user.id; // Get the authenticated user's ID from the token

  db.query(
    "SELECT * FROM dynamic_qrcodes WHERE user_id = ?",
    [userId],
    (err, results) => {
      if (err) throw err;
      res.json(results);
    }
  );
});

// Update a dynamic QR code
app.put("/api/dynamic-qrcodes/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const { redirect_url } = req.body;
  const userId = req.user.id; // Get the authenticated user's ID from the token

  // Verify ownership before updating
  db.query(
    "SELECT * FROM dynamic_qrcodes WHERE id = ? AND user_id = ?",
    [id, userId],
    (err, results) => {
      if (err) throw err;
      if (results.length === 0) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      db.query(
        "UPDATE dynamic_qrcodes SET redirect_url = ? WHERE id = ?",
        [redirect_url, id],
        (err) => {
          if (err) throw err;
          res.json({ id, redirect_url });
        }
      );
    }
  );
});

// Delete a dynamic QR code
app.delete("/api/dynamic-qrcodes/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const userId = req.user.id; // Get the authenticated user's ID from the token

  // Verify ownership before deleting
  db.query(
    "SELECT * FROM dynamic_qrcodes WHERE id = ? AND user_id = ?",
    [id, userId],
    (err, results) => {
      if (err) throw err;
      if (results.length === 0) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      db.query("DELETE FROM dynamic_qrcodes WHERE id = ?", [id], (err) => {
        if (err) throw err;
        res.status(204).send();
      });
    }
  );
});

// Redirect for dynamic QR codes
app.get("/qr/:id", (req, res) => {
  const { id } = req.params;

  db.query(
    "SELECT redirect_url FROM dynamic_qrcodes WHERE id = ?",
    [id],
    (err, results) => {
      if (err) throw err;
      if (results.length > 0) {
        const redirectUrl = results[0].redirect_url;
        res.redirect(redirectUrl);
      } else {
        res.status(404).send("QR code not found");
      }
    }
  );
});

// Get the count of static QR codes
app.get("/api/static-qrcodes/count", authenticateToken, (req, res) => {
  const userId = req.user.id; // Get the authenticated user's ID from the token

  db.query(
    "SELECT COUNT(*) AS count FROM static_qrcodes WHERE user_id = ?",
    [userId],
    (err, results) => {
      if (err) {
        console.error("Error fetching static QR code count:", err);
        return res.status(500).json({ error: "Error fetching count" });
      }
      res.json({ count: results[0].count });
    }
  );
});

// Get the count of dynamic QR codes
app.get("/api/dynamic-qrcodes/count", authenticateToken, (req, res) => {
  const userId = req.user.id; // Get the authenticated user's ID from the token

  db.query(
    "SELECT COUNT(*) AS count FROM dynamic_qrcodes WHERE user_id = ?",
    [userId],
    (err, results) => {
      if (err) {
        console.error("Error fetching dynamic QR code count:", err);
        return res.status(500).json({ error: "Error fetching count" });
      }
      res.json({ count: results[0].count });
    }
  );
});

// Create a short URL based on the server URL
app.post("/api/shorten", authenticateToken, (req, res) => {
  const { original_url } = req.body;
  const userId = req.user.id;

  // Validate URL
  if (!original_url) {
    return res.status(400).json({ error: "URL is required" });
  }

  // Generate a shortened URL
  const shortPath = Math.random().toString(36).substr(2, 5);
  const shortUrl = `http://localhost:8000/short/${shortPath}`;

  // Save to database
  db.query(
    "INSERT INTO shortened_urls (user_id, original_url, short_path) VALUES (?, ?, ?)",
    [userId, original_url, shortPath],
    (err) => {
      if (err) {
        console.error("Error inserting shortened URL:", err);
        return res.status(500).json({ error: "Error inserting shortened URL" });
      }
      res.json({ short_url: shortUrl });
    }
  );
});

// Redirect for shortened URLs
app.get("/short/:id", (req, res) => {
  const { id } = req.params;

  db.query(
    "SELECT original_url FROM shortened_urls WHERE short_path = ?",
    [id],
    (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).send("Server error");
      }
      if (results.length === 0) {
        return res.status(404).send("URL not found");
      }

      const originalUrl = results[0].original_url;
      res.redirect(originalUrl);
    }
  );
});

// Get all shortened URLs
app.get("/api/shortened-urls", authenticateToken, (req, res) => {
  const userId = req.user.id;

  db.query(
    "SELECT * FROM shortened_urls WHERE user_id = ?",
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.json(results);
    }
  );
});

// Update a shortened URL
app.put("/api/shortened-urls/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const { original_url } = req.body;
  const userId = req.user.id;

  // Verify ownership before updating
  db.query(
    "SELECT * FROM shortened_urls WHERE id = ? AND user_id = ?",
    [id, userId],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (results.length === 0)
        return res.status(403).json({ error: "Unauthorized" });

      db.query(
        "UPDATE shortened_urls SET original_url = ? WHERE id = ?",
        [original_url, id],
        (err) => {
          if (err) return res.status(500).json({ error: "Database error" });
          res.json({ id, original_url });
        }
      );
    }
  );
});

// Delete a shortened URL
app.delete("/api/shortened-urls/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  // Verify ownership before deleting
  db.query(
    "SELECT * FROM shortened_urls WHERE id = ? AND user_id = ?",
    [id, userId],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (results.length === 0)
        return res.status(403).json({ error: "Unauthorized" });

      db.query("DELETE FROM shortened_urls WHERE id = ?", [id], (err) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.status(204).send();
      });
    }
  );
});

// Get the count of shortened URLs for the authenticated user
app.get("/api/shortened-urls/count", authenticateToken, (req, res) => {
  const userId = req.user.id; // Get the authenticated user's ID from the token

  db.query(
    "SELECT COUNT(*) AS count FROM shortened_urls WHERE user_id = ?",
    [userId],
    (err, results) => {
      if (err) {
        console.error("Error fetching shortened URL count:", err);
        return res.status(500).json({ error: "Database query error" });
      }
      res.json({ count: results[0].count });
    }
  );
});

// Update user's theme preference
app.put("/api/user/theme", authenticateToken, (req, res) => {
  const { theme } = req.body;
  const userId = req.user.id;

  if (!['light', 'dark'].includes(theme)) {
    return res.status(400).json({ message: "Invalid theme preference." });
  }

  db.query(
    "UPDATE users SET theme = ? WHERE id = ?",
    [theme, userId],
    (err, results) => {
      if (err) {
        console.error("Error updating theme:", err);
        return res.status(500).json({ message: "Database update error." });
      }
      res.json({ message: "Theme updated successfully." });
    }
  );
});


const PORT = process.env.PORT || 8000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
