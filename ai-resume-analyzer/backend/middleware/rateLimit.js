import Document from "../models/Document.js";

export const limitDocumentsPerDay =
  (maxDocs = 10) =>
  async (req, res, next) => {
    try {
      const userId = req.user && req.user._id;
      if (!userId) return res.status(401).json({ error: "Not authorized" });

      const since = new Date();
      since.setHours(0, 0, 0, 0);
      const count = await Document.countDocuments({
        user: userId,
        uploadedAt: { $gte: since },
      });
      if (count >= maxDocs)
        return res
          .status(429)
          .json({ error: `Daily limit of ${maxDocs} documents reached` });
      next();
    } catch (err) {
      next(err);
    }
  };

export default limitDocumentsPerDay;
