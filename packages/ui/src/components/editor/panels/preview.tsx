import {  Button, Heading, Stack, Text } from '@tokens-studio/ui';
import { Graph, Node } from '@tokens-studio/graph-engine';
import { reaction } from 'mobx';
import { useGraph } from '@tokens-studio/graph-editor';
import { useParams } from 'next/navigation.js';
import { v4 as uuid } from 'uuid';
import Angular from '@/assets/svgs/angular.svg'
import Link from 'next/link.js';
import React, { useEffect, useState } from 'react';
import ReactIcon from '@/assets/svgs/react.svg'
import SolidIcon from '@/assets/svgs/solid.svg'
import SvelteIcon from '@/assets/svgs/svelte.svg'
import VanillaIcon from '@/assets/svgs/js.svg'
import VueIcon from '@/assets/svgs/vue.svg'


const findOutput = (graph: Graph) => {
    return Object.values(graph.nodes).find(x => x.factory.type == 'studio.tokens.generic.output')
}

const useFindOutput = (graph: Graph) => {


    const [outputNode, setOutputNode] = useState<Node | undefined>();



    useEffect(() => {
        let unsub = () => { }
        const foundOutput = outputNode || findOutput(graph);
        if (!foundOutput) {
            const unsubscribe = graph.on('nodeAdded', (x) => {
                if (x.factory.type == 'studio.tokens.generic.output') {
                    setOutputNode(x)
                }
            })

            unsub = unsubscribe
        } else {
            setOutputNode(foundOutput);
        }
        return unsub;
    }, [graph])



    return outputNode
}

const ImageIcon = ({ src }) => {

    return <img src={src} style={{ width: '24px', height: '24px' }} />
}


export const Listener = ({ previewId }) => {

    const graph = useGraph();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const output = useFindOutput(graph!);

    const [channel, setChannel] = useState<BroadcastChannel | null>(null);


    useEffect(() => {

        const bc = new BroadcastChannel(`preview:${previewId}`);
        setChannel(bc);
        return () => bc.close();
    }, [previewId])

    useEffect(() => {


        if (!output) {
            return () => {
                //nothing
            };
        }

        function setupReactions(node: Node) {
            const disposers = new Map();
            const output = {};
            let last = 'export default {}';

            function serialize() {
                last = 'export default ' + JSON.stringify(output, null, 4)
                channel?.postMessage({
                    type: 'data',
                    data: last
                })
            }

            channel!.onmessage = (e) => {

                if (e.type === 'request') {
                    channel?.postMessage({
                        type: 'data',
                        data: last
                    })
                }
            }

            const top = reaction(
                () => Object.keys(node.inputs),
                (outputKeys) => {

                    // Remove reactions for outputs that no longer exist
                    for (const [key, disposer] of disposers.entries()) {
                        if (!outputKeys.includes(key)) {
                            disposer();
                            delete output[key];
                            disposers.delete(key);
                        }
                    }

                    // Add reactions for new outputs
                    outputKeys.forEach(key => {
                        output[key] = node.inputs[key].value
                        if (!disposers.has(key)) {
                            const disposer = reaction(
                                () => node.inputs[key].value,
                                (value) => {
                                    output[key] = value
                                    serialize();
                                },
                                { fireImmediately: true }
                            );
                            disposers.set(key, disposer);
                        }
                    });
                    serialize();
                },
                { fireImmediately: true }
            );

            // Return a function to dispose all reactions
            return () => {
                for (const disposer of disposers.values()) {
                    disposer();
                }
                disposers.clear();
                top();
            };
        }


        const dispose = setupReactions(output);

        return dispose
    }, [output, channel]);
    return <></>

}

export const Preview = () => {

    const { id } = useParams();
    const [previewId, setId] = useState(id || uuid());

    return <Stack direction='column' gap={2} css={{ padding: '$3 $3' }}>
        <Listener previewId={previewId} />
        <Heading>
            Choose a framework
        </Heading>
        <Stack direction='row' gap={3} wrap>
            <Link href={`/preview?id=${previewId}&template=react`} target='_blank'>
                <Button icon={<ImageIcon src={ReactIcon.src} />}>
                    React
                </Button>
            </Link>
            <Link href={`/preview?id=${previewId}&template=angular`} target='_blank'>
                <Button icon={<ImageIcon src={Angular.src} />}>
                    Angular
                </Button>
            </Link>
            <Link href={`/preview?id=${previewId}&template=vue`} target='_blank'>
                <Button icon={<ImageIcon src={VueIcon.src} />}>
                    Vue
                </Button>
            </Link>
            <Link href={`/preview?id=${previewId}&template=svelte`} target='_blank'>
                <Button icon={<ImageIcon src={SvelteIcon.src} />}>
                    Svelte
                </Button>
            </Link>
            <Link href={`/preview?id=${previewId}&template=solid`} target='_blank'>
                <Button icon={<ImageIcon src={SolidIcon.src} />}>
                    Solid
                </Button>
            </Link>
            <Link href={`/preview?id=${previewId}&template=vanilla`} target='_blank'>
                <Button icon={<ImageIcon src={VanillaIcon.src} />}>
                    Vanilla JS
                </Button>
            </Link>
        </Stack>
        <Text>
            Keep this panel open for previews to work
        </Text>
        <Text muted size='xsmall'>
            Previews are opened in a seperated tab, but any changes within this tab will automatically update the preview values. You can have multiple different previews open.
        </Text>
    </Stack>
};

