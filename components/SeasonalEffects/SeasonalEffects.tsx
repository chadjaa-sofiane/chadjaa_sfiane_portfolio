import React from 'react';
import Snow from './Snow/Snow';

// Define available seasons
export type Season = 'winter' | 'none';

interface SeasonalEffectsProps {
    season?: Season;
}

const SeasonalEffects: React.FC<SeasonalEffectsProps> = ({ season = 'none' }) => {
    switch (season) {
        case 'winter':
            return <Snow />;
        default:
            return null;
    }
};

export default SeasonalEffects;
