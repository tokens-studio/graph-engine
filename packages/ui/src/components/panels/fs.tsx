import { Box, Button, Stack, Text } from '@tokens-studio/ui';
import React, { useCallback, useMemo } from 'react';
import { fs } from '../editor/data.ts';
import { ChevronDownIcon, FileIcon, FolderIcon } from '@iconicicons/react';
import { styled } from '@/lib/stitches/stitches.config.ts';


type DirectoryProps = {
    name: string,
    type: 'directory' | 'file',
    items: DirectoryProps[]
}

const File = styled(Box, {
    cursor: 'pointer',
    userSelect: 'none',
    ':hover': {
        backgroundColor: '$bgSubtle'
    }
});

const Dir = styled(Box, {
    cursor: 'pointer',
    userSelect: 'none',
    ':hover': {
        backgroundColor: '$bgSubtle'
    }
});

function readFileAsBuffer(file): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();

        fileReader.onload = () => {
            const buffer = fileReader.result;
            resolve(Buffer.from(buffer as ArrayBuffer));
        };

        fileReader.onerror = () => {
            reject(fileReader.error);
        };

        fileReader.onabort = () => {
            reject(new Error("File reading aborted"));
        };

        if (file.size > 20 * 1024 * 1024) {
            reject(new Error("File size exceeds 20MB limit"));
        } else {
            fileReader.readAsArrayBuffer(file);
        }
    });
}



export const Directory = ({ files, indent = 0 }: { files: DirectoryProps, indent: number }) => {

    const [isExpanded, setIsExpanded] = React.useState(false);


    //Handle simple file
    if (files.type === 'file') {
        return <File>
            <Stack direction='row' gap={2} css={{ paddingLeft: indent * 10 + 'px' }}>
                <FileIcon />
                <Text >{files.name}</Text>
            </Stack>
        </File >
    }



    return (
        <Stack direction='column' css={{ paddingLeft: indent * 10 + 'px' }}>
            <Dir onClick={() => setIsExpanded(!isExpanded)} css={{ padding: '$1', cursor: 'pointer' }}>
                <Stack direction='row' gap={2}>
                    <ChevronDownIcon style={{ transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)' }} />
                    <Text>
                        {files.name}
                    </Text>
                </Stack>
            </Dir>
            <>
                {isExpanded && files.items.map(x => <Directory files={x} indent={indent + 1} />)}
            </>

        </Stack>
    )

}


export const FsPanel = () => {

    const [_, update] = React.useState<number>(0);

    useMemo(() => {
        fs.subscribe((action) => {
            if (action.method.startsWith('write')) {
                update(Math.random());
            }
        })
    }, [])

    // Read all the items from the files system and convert to directoryProps 
    const items = fs.readdirSync('/', { withFileTypes: true }).map(x => {
        if (x.isDirectory()) {
            return {
                name: x.name,
                type: 'directory',
                items: fs.readdirSync(x.name, { withFileTypes: true }).map(y => {
                    return {
                        name: y.name,
                        type: y.isDirectory() ? 'directory' : 'file',
                        items: []
                    } as DirectoryProps
                })
            }
        } else {
            return {
                name: x.name,
                type: 'file',
                items: []
            } as DirectoryProps
        }
    }) as DirectoryProps[]



    return <Box css={{ padding: '$2' }}>
        <Stack direction='column'>
            <Directory files={{ name: '/', type: 'directory', items: items }} indent={0} />
        </Stack>
    </Box>

};