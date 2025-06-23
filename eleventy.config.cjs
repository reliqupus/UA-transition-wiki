const { DateTime } = require("luxon");
const pluginSEO = require("eleventy-plugin-seo");

const PREFIX = "UA-transition-wiki";

module.exports = function (eleventyConfig) {
    eleventyConfig.setTemplateFormats([
        // Templates:
        "html",
        "njk",
        "md",
        // Static Assets:
        "css",
        "jpeg",
        "jpg",
        "png",
        "svg",
        "woff",
        "woff2"
    ]);
    eleventyConfig.addPassthroughCopy("public");

    const seo = require("./src/seo.json");
    // if (seo.url === "glitch-default") {
    //     seo.url = `https://${process.env.PROJECT_DOMAIN}.glitch.me`;
    // }
    eleventyConfig.addPlugin(pluginSEO, seo);

    // Filters let you modify the content https://www.11ty.dev/docs/filters/
    eleventyConfig.addFilter("htmlDateString", dateObj => {
        return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("yyyy-LL-dd");
    });

    eleventyConfig.addFilter("PREFIX", string => {
        return `/${PREFIX}${string}`;
    });

    eleventyConfig.setBrowserSyncConfig({ ghostMode: false });

    /* Build the collection of posts to list in the site
       - Read the Next Steps post to learn how to extend this
    */
    eleventyConfig.addCollection("posts", function (collection) {
        /* The posts collection includes all posts that list 'posts' in the front matter 'tags'
           - https://www.11ty.dev/docs/collections/
        */
        const coll = collection
            .getFilteredByTag("Posts");

        for (let i = 0; i < coll.length; i++) {
            const prevPost = coll[i - 1];
            const nextPost = coll[i + 1];

            coll[i].data["prevPost"] = prevPost;
            coll[i].data["nextPost"] = nextPost;
        }

        return coll;
    });

    eleventyConfig.addCollection("tagsList", function (collectionApi) {
        const tagsList = new Set();
        collectionApi.getAll().map(item => {
            if (item.data.tags) {
                // handle pages that don't have tags
                item.data.tags.map(tag => tagsList.add(tag))
            }
        });
        return tagsList;
    });


    return {
        dir: {
            input: "src",
            includes: "includes",
            output: "build"
        }
    };
};
