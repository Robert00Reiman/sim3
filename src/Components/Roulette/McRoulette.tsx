import React, {useRef, useState, useEffect} from 'react';
import cl from "./roulette.module.scss"
import RouletteItem from "./RouletteItem/RouletteItem";
import {Roulette, weaponAttributes} from "../../roulette.classes";
const sequence = require('../../rouletteSequence.json');

interface RouletteElementParams {
    weapons: weaponAttributes[],
    weaponsCount: number,
    transitionDuration: number
}

interface SequenceItem {
    weapon_name: string;
    skin_name: string;
}

const McRoulette = ({
                             weapons,
                             weaponsCount,
                             transitionDuration
                         }: RouletteElementParams) => {

    const [rouletteWeapons, setRouletteWeapons] = useState<weaponAttributes[]>(() => {
        return sequence.map((seqItem: SequenceItem) => {
            const weapon = weapons.find(w => 
                w.weapon_name === seqItem.weapon_name && 
                w.skin_name === seqItem.skin_name
            );
            if (!weapon) {
                console.error(`Weapon not found: ${seqItem.weapon_name} ${seqItem.skin_name}`);
                return weapons[0];
            }
            return weapon;
        });
    });
    const [weaponPrizeId, setWeaponPrizeId] = useState<number>(-1)
    const [isReplay, setIsReplay] = useState<boolean>(false)
    const [isSpin, setIsSpin] = useState<boolean>(false)
    const [winHistory, setWinHistory] = useState<weaponAttributes[]>([])
    const [hasRolled, setHasRolled] = useState<boolean>(false)

    const rouletteContainerRef = useRef<HTMLDivElement>(null)
    const weaponsRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (weaponsRef.current && rouletteContainerRef.current) {
            const weaponWidth = 200;
            const containerWidth = rouletteContainerRef.current.offsetWidth;
            const centerPosition = Math.floor(containerWidth / 2);
            const initialOffset = centerPosition - (2.5 * weaponWidth); // Center the sequence (2.5 items from the left edge)
            weaponsRef.current.style.left = `${initialOffset}px`;
        }
    }, []);

    function transitionEndHandler() {
        setWinHistory(winHistory.concat(rouletteWeapons[weaponPrizeId]))
        setIsSpin(false)
    }

    function prepare() {
        if (weaponsRef.current) {
            weaponsRef.current.style.transition = "none";
            weaponsRef.current.style.left = "0px";
        }
    }

    function load() {
        const extendedSequence = [...sequence, ...sequence];
        
        const sequenceWeapons = extendedSequence.map((seqItem: SequenceItem) => {
            const weapon = weapons.find(w => 
                w.weapon_name === seqItem.weapon_name && 
                w.skin_name === seqItem.skin_name
            );
            if (!weapon) {
                console.error(`Weapon not found: ${seqItem.weapon_name} ${seqItem.skin_name}`);
                return weapons[0];
            }
            return weapon;
        });

        setRouletteWeapons(sequenceWeapons);
        return sequenceWeapons;
    }

    function play() {
        if (isReplay) {
            prepare();
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    const weapons = load();
                    setIsSpin(true);
                    spinToTarget();
                });
            });
        } else {
            const weapons = load();
            setIsSpin(true);
            spinToTarget();
        }
        
        setHasRolled(true);
        setIsReplay(true);
    }

    function spinToTarget() {
        if (weaponsRef.current) {
            const weaponWidth = 200;
            const containerWidth = rouletteContainerRef.current!.offsetWidth;
            const centerPosition = Math.floor(containerWidth / 2);
            const targetPosition = -(56 * weaponWidth) + centerPosition - (weaponWidth / 2);
            
            weaponsRef.current.style.transition = `all ${transitionDuration}s cubic-bezier(0.21, 0.53, 0.29, 0.99)`;
            weaponsRef.current.style.left = `${targetPosition}px`;
        }
        
        setWeaponPrizeId(56);
    }

    return (
        <div>
            <div className={cl.rouletteWrapper}>
                <div ref={rouletteContainerRef} className={cl.evRoulette}>
                    <div className={cl.evTarget}></div>
                    <div 
                        ref={weaponsRef} 
                        className={cl.evWeapons} 
                        onTransitionEnd={transitionEndHandler}
                    >
                        {rouletteWeapons.map((w, i) => (
                            <RouletteItem
                                key={i}
                                id={i}
                                isLoser={false}
                                weapon_name={w.weapon_name}
                                skin_name={w.skin_name}
                                rarity={w.rarity}
                                steam_image={w.steam_image}
                            />
                        ))}
                    </div>
                </div>
                {!hasRolled && (
                    <button 
                        className={cl.button} 
                        disabled={isSpin} 
                        onClick={play}
                    >
                        Roll
                    </button>
                )}
            </div>
        </div>
    );
};

export default McRoulette;