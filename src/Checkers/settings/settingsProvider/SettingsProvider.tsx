import { FC, ReactNode } from "react";
import { SettingsContextType, SettingsProviderContext } from "./SettingsContext.tsx";

/**
 * Props for the Settings Provider.
 */
interface UseSettingsProviderProps {

}

const useSettingsProvider = ({

}: UseSettingsProviderProps) => {
    return {
        
    }
};


/**
 * Props for the UI Provider.
 * - `children`: All components that are wrapped by the provider.
 */
interface SettingsProviderProps {
    children: ReactNode;
}

/**
 * @param {SettingsProviderProps} props - The props for the Settings Provider.
 * @returns {ReactNode} The Settings Provider component.
 */
export const SettingsProvider: FC<SettingsProviderProps> = ({ 
    children,
    ...rest
}) => {
    const value: SettingsContextType = useSettingsProvider(rest);
    return (
        <SettingsProviderContext.Provider 
            value={value}
        >
            {children}
        </SettingsProviderContext.Provider>
    );
};