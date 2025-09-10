import { Currencies } from "./currencies";

export function getFormatterForCurrency(currency: string) {
    const locale = Currencies.find((c) => c.value === currency )?.locale;

    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency
    })
}