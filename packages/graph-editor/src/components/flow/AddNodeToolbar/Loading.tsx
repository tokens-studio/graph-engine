
import { Spinner, Stack } from '@tokens-studio/ui'
import React from 'react'

export const Loading = () => {
    return (
        <Stack direction='row' align='center' justify='center' css={{ height: '100%' }}>
            <Spinner size={'medium'} />
        </Stack>
    )
}
