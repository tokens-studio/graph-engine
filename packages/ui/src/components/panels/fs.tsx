import { Box, Button, Stack, Text } from '@tokens-studio/ui';
import React, { useCallback, useEffect, useMemo } from 'react';
import { fs } from '../editor/data.ts';
import { ChevronDownIcon, FileIcon, FolderIcon } from '@iconicicons/react';
import { styled } from '@/lib/stitches/stitches.config.ts';
import { join } from 'path';


type DirectoryProps = {
    name: string,
    parentPath: string,
    type: 'directory' | 'file',
    items: DirectoryProps[]
}

const File = styled(Box, {
    cursor: 'pointer',
    userSelect: 'none',
    ':hover,[data-hovering]': {
        backgroundColor: '$bgSubtle'
    }
});

const Dir = styled('div', {
    cursor: 'pointer',
    userSelect: 'none',
    ':hover,[data-hovering]': {
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

    const [isExpanded, setIsExpanded] = React.useState(true);

    const [hovering, setHovering] = React.useState(false);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = 'copy';
        setHovering(true);
    }, []);


    const handleDrop = useCallback(async (e) => {

        e.preventDefault();
        e.stopPropagation();
        let dt = e.dataTransfer;

        //Change fileList to array
        let rawfiles = [...dt.files];

        rawfiles.map(async (file) => {

            const buffer = await readFileAsBuffer(file);
            const filePath = join(files.parentPath, files.name, file.name);
            console.log(filePath)
            fs.writeFileSync(filePath, buffer)
        });
    }, [files.name, files.parentPath])

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
            <Dir onClick={() => setIsExpanded(!isExpanded)} css={{ padding: '$1', cursor: 'pointer', background: hovering ? '$bgSubtle' : 'transparent' }}
                onDragEnter={handleDragOver}
                onDragOver={handleDragOver}
                onDragLeave={() => setHovering(false)}
                onDrop={handleDrop} data-hovering={hovering}>
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

const readItemsRecursively = (path: string, parent: string = '') => {
    const items = fs.readdirSync(path
        , { withFileTypes: true }).map(x => {
            if (x.isDirectory()) {
                return {
                    parentPath: parent,
                    name: x.name,
                    type: 'directory',
                    items: readItemsRecursively(x.name, parent + x.name + '/')
                }
            } else {
                return {
                    parentPath: parent,
                    name: x.name,
                    type: 'file',
                    items: []
                }
            }
        }) as DirectoryProps[]
    return items;
}

export const FsPanel = () => {
    const [trigger, setTrigger] = React.useState(0);
    const tree = useMemo(() => readItemsRecursively('/', ''), [trigger]);

    //Note that using the filesystem spy is causing weird errors
    useEffect(() => {
        const watcher = fs.watch('/', { recursive: true }, (eventType, filename) => {
            console.log(eventType, filename)
            setTrigger(Math.random());
        })
        return () => watcher.close();
    }, [])

    return <Box css={{ padding: '$2' }}>
        <Stack direction='column'>
            <Directory files={{ name: '/', type: 'directory', items: tree, parentPath: '' }} indent={0} />
        </Stack>
    </Box>

};