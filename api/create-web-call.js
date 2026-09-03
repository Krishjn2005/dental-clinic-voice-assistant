// This file must live at: api/create-web-call.js in your project
// (the "api" folder is what makes Vercel treat it as a serverless function)

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { agentId, dynamicVariables } = req.body;

    if (!agentId) {
      res.status(400).json({ error: 'Missing agentId' });
      return;
    }

    const response = await fetch('https://api.retellai.com/v2/create-web-call', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + process.env.RETELL_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agent_id: agentId,
        retell_llm_dynamic_variables: dynamicVariables || {},
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      res.status(response.status).json(data);
      return;
    }

    res.status(200).json({
      access_token: data.access_token,
      call_id: data.call_id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
