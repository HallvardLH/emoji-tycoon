import { useSelector } from 'react-redux';
import { RootState } from '../../scripts/redux/reduxStore';
import Text from '../generalUI/Text';
import { formatNumber } from '../../scripts/misc';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

interface EpsAmountProps {
    fontSize?: number;
}

export default function EpsAmount({ fontSize = 20 }: EpsAmountProps) {
    const { t } = useTranslation();
    const emojisPerSecond = useSelector((state: RootState) => state.values.emojisPerSecond);

    const formattedValue = useMemo(() =>
        formatNumber(emojisPerSecond, 1),
        [emojisPerSecond]
    );

    const textStyle = useMemo(() => ({ fontSize }), [fontSize]);

    return (
        <Text style={textStyle} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.5}>{t("header.perSecond", { value: formattedValue })}</Text>
    );
}