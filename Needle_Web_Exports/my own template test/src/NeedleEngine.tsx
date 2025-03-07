import "@needle-tools/engine";
import { NeedleEngineAttributes } from "@needle-tools/engine";
import React, { ReactElement } from 'react'
  
export function NeedleEngine(props: NeedleEngineAttributes | { children?: any }): ReactElement<NeedleEngineAttributes> {
    return <needle-engine type ='module' {...props}>
        {props.children}
    </needle-engine>;
}
