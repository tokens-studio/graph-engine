import { executeNode } from "#/core.js";
import { node } from "#/nodes/set/resolve.js";
import { IResolvedToken, flatten } from "#/utils/index.js";

describe("set/resolve", () => {
  it("resolves complex values correctly", async () => {
    const output = await executeNode({
      input: {
        context: flatten({
          border: {
            value: {
              color: "#ff5757",
              style: "dashed",
              width: "2px",
            },
            type: "border",
            description: "",
          },
          box: {
            value: [
              {
                color: "#eb0000",
                type: "dropShadow",
                x: "14",
                y: "51",
              },
            ],
            type: "boxShadow",
            description: "",
          },
          typo: {
            value: {
              lineHeight: "1.5",
              fontFamily: "Inter",
              fontWeight: "500",
            },
            type: "typography",
            description: "",
          },
        } as unknown as Record<string, IResolvedToken>),

        inputs: flatten({
          "ref-border": {
            value: "{border}",
            type: "border",
            description: "",
          },
          "ref-box": {
            value: "{box}",
            type: "boxShadow",
            description: "",
          },
          "ref-typo": {
            value: "{typo}",
            type: "typography",
            description: "",
          },
        } as unknown as Record<string, IResolvedToken>),
      },
      node,
      state: {},
      nodeId: "",
    });

    expect(output).toStrictEqual({
      "as Set": [
        {
          description: "",
          name: "ref-border",
          type: "border",
          value: {
            color: "#ff5757",
            style: "dashed",
            width: "2px",
          },
        },
        {
          name: "ref-box",
          description: "",
          type: "boxShadow",
          value: [
            {
              color: "#eb0000",
              type: "dropShadow",
              x: 14,
              y: 51,
            },
          ],
        },
        {
          description: "",
          name: "ref-typo",
          type: "typography",
          value: {
            lineHeight: 1.5,
            fontFamily: "Inter",
            fontWeight: 500,
          },
        },
      ],
      "ref-border": {
        description: "",
        name: "ref-border",
        type: "border",
        value: {
          color: "#ff5757",
          style: "dashed",
          width: "2px",
        },
      },
      "ref-box": {
        name: "ref-box",
        description: "",
        type: "boxShadow",
        value: [
          {
            color: "#eb0000",
            type: "dropShadow",
            x: 14,
            y: 51,
          },
        ],
      },

      "ref-typo": {
        name: "ref-typo",
        description: "",
        type: "typography",
        value: {
          lineHeight: 1.5,
          fontFamily: "Inter",
          fontWeight: 500,
        },
      },
    });
  });
});
