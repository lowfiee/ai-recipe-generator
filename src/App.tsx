import { useState } from "react";
import { Heading, View } from "@aws-amplify/ui-react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";

const client = generateClient<Schema>();

export default function App() {
  const { signOut } = useAuthenticator();
  const [ingredients, setIngredients] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setResult("");

    try {
      const response = await client.queries.askBedrock({
        ingredients: ingredients
          .split(",")
          .map((i) => i.trim())
          .filter(Boolean),
      });

      if (response?.data?.body) {
        setResult(response.data.body);
      } else {
        setError("No response from AI model.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong generating the recipe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="app-container">
      <div className="cherry-card">
        <Heading level={1}>🍒 Welcome, User</Heading>

        <button className="signout-btn" onClick={signOut}>
          Sign out
        </button>

        <hr style={{ margin: "2rem 0" }} />

        <Heading level={2}>🍒 Meet Your Personal Recipe AI</Heading>

        <p>
          Simply type a few ingredients using the format{" "}
          <strong>ingredient1, ingredient2</strong>, etc., and Recipe AI
          will generate an all-new recipe on demand.
        </p>

        <input
          className="ai-input"
          placeholder="chicken, white rice, garlic"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
        />

        <button
          className="generate-btn"
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate"}
        </button>

        {result && (
          <div className="error-box" style={{ whiteSpace: "pre-wrap" }}>
            {result}
          </div>
        )}

        {error && <div className="error-box">{error}</div>}
      </div>
    </View>
  );
}
