import { Accordion, Button, Separator, Stack } from "@tokens-studio/ui";
import { IField } from "@tokens-studio/graph-editor";
import { Token } from "./token.js";
import { observer } from "mobx-react-lite";
import React from "react";

export const TokenArrayField = observer(({ port }: IField) => {
  return (
    <Stack gap={4} direction="column" align="center">
      <Accordion type="multiple" defaultValue={["tokens"]}>
        <Accordion.Item value="tokens">
          <Accordion.Trigger>Tokens</Accordion.Trigger>
          <Separator orientation="horizontal" />
          <Accordion.Content>
            <Stack
              gap={4}
              direction="column"
              align="center"
              css={{ padding: "$3" }}
            >
              {(port.value || []).map((token) => (
                <Token token={token} key={token.name} />
              ))}
            </Stack>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>

      <Button onClick={downloadTokens}>Download</Button>
    </Stack>
  );
});
