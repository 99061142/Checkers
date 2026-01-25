import { FC } from 'react';
import styles from './LoadingFallback.module.scss';

const LoadingFallback: FC = () => {
    return (
        <div
            className={`spinner-border ${styles.loadingSpinner}`}
            role="status"
        />
    );
}

export default LoadingFallback;