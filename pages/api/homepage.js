import { withSentry } from "@sentry/nextjs";

import { getMonitors } from "../../lib/monitors";

const handler = async (req, res) => {
  const { slug } = req.query;
  try {
    let monitors = await getMonitors();
    res.status(200).json(monitors);
  } catch (error) {
    res.status(500);
  }
};

export default withSentry(handler);
