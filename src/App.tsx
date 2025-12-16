import { useState, useEffect } from "react";
import {
  Button,
  Heading,
  View,
  Card,
  Divider,
} from "@aws-amplify/ui-react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { generateClient } from "aws-amplify/data";

/**
 * @type {import('aws-amplify/data').Client}
 */
const client = generateClient({
  authMode: "userPool",
});

export default function App() {
  const [userProfiles, setUserProfiles] = useState([]);
  // @ts-ignore
  const { user, signOut } = useAuthenticator((context) => [context.user]);

  useEffect(() => {
    async function fetchProfiles() {
      try {
        // @ts-ignore
        const result = await client.models.UserProfile.list();
        setUserProfiles(result.data);
      } catch (error) {
        console.error("Error fetching user profiles:", error);
      }
    }

    fetchProfiles();
  }, []);

  return (
    <View className="app-container">
      <Card className="bunny-card">
        <Heading level={2}>🍒 Welcome, User</Heading>
        <Divider />

        <Button onClick={signOut}>Sign out</Button>

        <Divider />
        <h3>🍒 User Profiles:</h3>

        {userProfiles.length > 0 ? (
          <ul>
            {userProfiles.map((profile, i) => (
              // @ts-ignore
              <li key={i}>{profile.name}</li>
            ))}
          </ul>
        ) : (
          <p>No profiles found yet!</p>
        )}
      </Card>
    </View>
  );
}
