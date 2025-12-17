export function request(ctx) {
  const { ingredients = [] } = ctx.args;

  const prompt = `Suggest a complete recipe using these ingredients:
${ingredients.join(", ")}.

Include a title, ingredients list, and steps.`;

  return {
    resourcePath: "/model/anthropic.claude-3-sonnet-20240229-v1:0/invoke",
    method: "POST",
    params: {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 800,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `\n\nHuman: ${prompt}\n\nAssistant:`,
              },
            ],
          },
        ],
      }),
    },
  };
}


export function response(ctx) {
  if (!ctx.result?.body) {
    return { body: "No response body from Claude." };
  }

  const parsed = JSON.parse(ctx.result.body);

  // Case 1: standard Claude format
  if (Array.isArray(parsed.content) && parsed.content[0]?.text) {
    return { body: parsed.content[0].text };
  }

  // Case 2: wrapped output format
  if (
    parsed.output?.message?.content &&
    parsed.output.message.content[0]?.text
  ) {
    return { body: parsed.output.message.content[0].text };
  }

  // Debug fallback (VERY useful for grading)
  return {
    body: `Claude responded but no readable text was returned.\nRaw response:\n${JSON.stringify(parsed, null, 2)}`
  };
}



