'use client'

import React, { useState } from 'react'
import { useServerInsertedHTML } from 'next/navigation.js'
import { getCssText } from '@/lib/stitches/index.ts';

export default function StitchesProvider({
    children,
}: {
    children: React.ReactNode
}) {

    useServerInsertedHTML(() => {
        return <style>{getCssText()}</style>
    })

    return <>{children}</>
}