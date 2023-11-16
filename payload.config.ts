const { buildConfig } = require("payload/config");
const { webpackBundler } = require("@payloadcms/bundler-webpack");
const { slateEditor } = require("@payloadcms/richtext-slate");
const { mongooseAdapter } = require("@payloadcms/db-mongodb");
const seo = require("@payloadcms/plugin-seo");
const { CollectionConfig } = require("payload/types");

module.exports = buildConfig({
  admin: {
    bundler: webpackBundler(), // or viteBundler()
  },
  db: mongooseAdapter({
    url: process.env.MONGO_URL || "",
  }), // or postgresAdapter({}),
  editor: slateEditor({}), // or slateEditor({})
  collections: [
    {
      slug: "pages",
      fields: [],
    },
    require("./src/collection/Media.ts"),
  ],
  plugins: [
    seo.default({
      collections: ["pages"],
      uploadsCollection: "media",
      generateTitle: ({ doc }) =>
        `${process.env.WEBSITE_NAME} — ${doc.title.value}`,
      generateDescription: ({ doc }) => doc.excerpt,
    }),
  ],
  upload: {
    limits: {
      fileSize: 50000000, // 50MB, written in bytes
    },
  },
});
