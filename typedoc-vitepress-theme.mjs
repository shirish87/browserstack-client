import * as fs from "fs";
import * as path from "path";
import { DEFAULT_SIDEBAR_OPTIONS } from "typedoc-vitepress-theme/dist/options.js";
import * as options from "typedoc-vitepress-theme/dist/options/declarations.js";
import presets from "typedoc-vitepress-theme/dist/options/presets.js";
import { getSidebar } from "typedoc-vitepress-theme/dist/sidebars/sidebars.js";
import { VitepressTheme } from "typedoc-vitepress-theme/dist/theme.js";

export function load(app) {
  app.renderer.defineTheme("vitepress", VitepressTheme);

  Object.entries(options).forEach(([name, option]) => {
    app.options.addDeclaration({
      name,
      ...option,
    });
  });

  app.options.addReader({
    name: "vitepress-options",
    order: 0,
    supportsPackages: false,

    read(container) {
      Object.entries(presets).forEach(([key, value]) => {
        container.setValue("theme", "vitepress");
        container.setValue(key, value);
      });
    },
  });

  app.renderer.preRenderAsyncJobs.push(async ({ project }) => {
    const classes = project.children.filter(
      (o) => o.hasOwnDocument && o.kind === 0x80 && o.children.length > 0
    );

    for (const c of classes) {
      c.comment ??= [
        {
          blockTags: [],
          modifierTags: new Set(),
          summary: [],
        },
      ];

      const methods = c.children.filter((o) => o.kind === 0x800);
      if (methods.length) {
        c.comment.summary.push({
          kind: "text",
          text: "\n\n## Index",
        });
      }

      for (const m of methods) {
        c.comment.summary.push({
          kind: "text",
          text: [
            `\n\n* [${m.name}](#${m.anchor})`,
            m.signatures?.[0]?.comment?.summary?.[0]?.text,
          ]
            .filter((s) => Boolean(s))
            .join(" — "),
        });
      }
    }
  });

  app.renderer.postRenderAsyncJobs.push(async (output) => {
    const sidebarOptions = {
      ...DEFAULT_SIDEBAR_OPTIONS,
      ...app.options.getValue("sidebar"),
    };
    if (sidebarOptions.autoConfiguration) {
      const outDir = app.options.getValue("out");
      const sidebarPath = path.resolve(outDir, "typedoc-sidebar.json");
      const basePath = path.relative(app.options.getValue("docsRoot"), outDir);

      const sidebarJson = getSidebar(
        output.navigation,
        basePath,
        sidebarOptions
      );
      fs.writeFileSync(
        sidebarPath,
        sidebarOptions.pretty
          ? JSON.stringify(sidebarJson, null, 2)
          : JSON.stringify(sidebarJson)
      );
    }
  });
}
