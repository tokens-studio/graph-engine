import React from 'react';
import { Box, Button, TextInput } from '@tokens-studio/ui';
import { useLocalGraph } from '@tokens-studio/graph-editor';

export const WebsocketPanel = () => {

    const [ws, setWs] = React.useState<WebSocket | null>(null);
    const [connecting, setConnecting] = React.useState<boolean>(false);
    const [host, setHost] = React.useState<string>('');
    const graph = useLocalGraph();


    const onClick = () => {

        if (!ws) {
            const socket = new WebSocket(host); 
            setConnecting(true);

            setWs(socket);
            socket.addEventListener("open", (event) => {
                console.log('connected');
                setConnecting(false);
            });
            socket.addEventListener("error", (err) => {
                console.log(err)
            });
        } else {

            ws.close();
            setWs(null);
        }

    };

    return <Box>

        <TextInput value={host} placeholder="ws://localhost:8080" onChange={(e) => setHost(e.target.value)} />
        <Button loading={connecting} onClick={onClick}>{!ws ? 'Connect' : 'Disconnect'}</Button>
        {ws && <Button onClick={() => ws?.send(JSON.stringify(graph))}>Send to server</Button>}

    </Box>;
};