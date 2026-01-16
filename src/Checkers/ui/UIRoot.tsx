import { FC, Fragment, ReactNode, Suspense, useMemo } from 'react';
import LoadingFallback from '../loadingFallback/LoadingFallback.tsx';
import { useUI } from './uiProvider/useUI.ts';
import { ComponentConfig } from './uiProvider/UIProviderUtils.ts';

const UIRoot: FC = () => {
    const {
        getCurrentDisplayedComponentsConfig
    } = useUI();

    /**
     * The configurations of the components that should currently be displayed.
     */
    const componentsConfig: ComponentConfig[] = useMemo(() => 
        getCurrentDisplayedComponentsConfig()
    , [getCurrentDisplayedComponentsConfig]);

    /**
     * The components to be rendered based on the current configuration.
     */
    const components: ReactNode[] = useMemo(() => {
        return componentsConfig.map((componentConfig: ComponentConfig, index: number) => {
            const { Component, shouldSuspense } = componentConfig;
            const key: string = Component.displayName || `Component-${index}`;

            return shouldSuspense ? (
                <Suspense
                    key={key} 
                    fallback={<LoadingFallback />}
                >
                    <Component />
                </Suspense>
            ) : (
                <Fragment
                    key={key}
                >
                    <Component />
                </Fragment>
            );
        });
    }, [componentsConfig]);

    return (
        <>
            {components}
        </>
    );
}

export default UIRoot;