import React from 'react';
import cl from './.module.css';

const LoadingAnimation = React.memo(({
    size = '120px',
    curveWidth = '16px',
    curveColor1 = '#00a193',
    curveColor2 = '#C99E22'
}) => {
    return (
        <div className={cl.main}>
            <div className={cl.loader} style={{
                width: size,
                height: size,
                border: `${curveWidth} solid ${curveColor1}`,
                borderTop: `${curveWidth} solid ${curveColor2}`,
                borderBottom: `${curveWidth} solid ${curveColor2}`
            }}></div>
        </div>
    );
});

export default LoadingAnimation;
