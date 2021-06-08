import { withSentry } from "@sentry/nextjs";

import { getMonitor } from "../../../lib/monitors";

const handler = async (req, res) => {
  const { slug } = req.query;
  try {
    const monitor = await getMonitor(slug);
    if (!monitor) {
      return res.status(404);
    }
    res.status(200).json(monitor);
  } catch (error) {
    res.status(500);
  }
};

export default withSentry(handler);
