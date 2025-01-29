import React from 'react';
import cl from './App.module.scss';
import weapons from "./weapons.json"
import McRoulette from "./Components/Roulette/McRoulette";
import backgroundImage from './background.jpeg';

function App() {

    const weaponsCount = 60
    const transitionDuration = 5

    return (
        <>
            <div className={cl.background} style={{ backgroundImage: `url(${backgroundImage})` }}></div>
            <div className={cl.App}>
                <div className={cl.wrapper}>
                    <McRoulette
                        weapons={weapons}
                        weaponsCount={weaponsCount}
                        transitionDuration={transitionDuration}
                    />
                </div>
            </div>
        </>
    );
}

export default App;
