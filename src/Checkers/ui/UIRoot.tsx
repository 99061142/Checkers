import { FC, Fragment, ReactNode, Suspense, useMemo } from 'react';
import LoadingFallback from '../loadingFallback/LoadingFallback.tsx';
import { useUI } from './uiProvider/useUI.ts';
import { ComponentConfig } from './uiProvider/UIProviderUtils.ts';

const UIRoot: FC = () => {
    const {
        getCurrentDisplayedComponentsConfig
    } = useUI();

    const components: ReactNode[] = useMemo(() => {
        const componentsConfig: ComponentConfig[] = getCurrentDisplayedComponentsConfig();
        return componentsConfig.map((componentConfig: ComponentConfig, index: number) => {
            const { Component, shouldSuspense } = componentConfig;
            return shouldSuspense ? (
                <Suspense
                    key={index} 
                    fallback={<LoadingFallback />}
                >
                    <Component />
                </Suspense>
            ) : (
                <Fragment
                    key={index}
                >
                    <Component />
                </Fragment>
            );
        });
    }, [getCurrentDisplayedComponentsConfig]);

    return (
        <>
            {components}
        </>
    );
}

export default UIRoot;