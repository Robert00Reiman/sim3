import {Ref} from "react";

export interface weaponAttributes {
    weapon_name: string,
    skin_name: string
    rarity: string
    steam_image: string,
}

interface RouletteParams {
    winner: weaponAttributes
    weapons: weaponAttributes[]
    rouletteContainerRef: React.RefObject<HTMLDivElement>
    weaponsRef: React.RefObject<HTMLDivElement>
    weaponsCount: number
    transitionDuration: number
}

// КЛАСС ОРУЖИЯ
export class Weapon {
    id: number
    weapon_name: string
    skin_name: string
    rarity: string
    steam_image: string

    constructor(id: number, attrs: weaponAttributes) {
        this.id = id;

        // атрибуты с сервера
        this.weapon_name = attrs.weapon_name;
        this.skin_name = attrs.skin_name;
        this.rarity = attrs.rarity;
        this.steam_image = attrs.steam_image;
    }

}

export interface rouletteAttributes {
    winner: weaponAttributes
    weapons: weaponAttributes[]

    rouletteContainerRef: Ref<HTMLElement>
    weaponsRef: Ref<HTMLElement>

    weaponsCount?: number
    transitionDuration?: number
    itemWidth?: number
}

// КЛАСС РУЛЕТКИ
export class Roulette {
    winner: weaponAttributes
    weapons: weaponAttributes[]
    rouletteContainerRef: React.RefObject<HTMLDivElement>
    weaponsRef: React.RefObject<HTMLDivElement>
    weaponsCount: number
    transitionDuration: number

    constructor({
        winner,
        weapons,
        rouletteContainerRef,
        weaponsRef,
        weaponsCount,
        transitionDuration
    }: RouletteParams) {
        this.winner = winner
        this.weapons = weapons
        this.rouletteContainerRef = rouletteContainerRef
        this.weaponsRef = weaponsRef
        this.weaponsCount = weaponsCount
        this.transitionDuration = transitionDuration
    }

    spin() {
        const weaponWidth = 200; // Width of each weapon item
        const containerWidth = this.rouletteContainerRef.current!.offsetWidth;
        const centerPosition = Math.floor(containerWidth / 2);
        
        // Calculate the position to center item 56
        const targetPosition = -(56 * weaponWidth) + centerPosition - (weaponWidth / 2);
        
        this.weaponsRef.current!.style.transition = `all ${this.transitionDuration}s cubic-bezier(0.21, 0.53, 0.29, 0.99)`;
        this.weaponsRef.current!.style.left = `${targetPosition}px`;
        
        return 56; // Always return position 56 as the winner
    }
}
