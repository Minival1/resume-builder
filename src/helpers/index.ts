interface DateObj {
    years: number,
    days: number,
    months: number
}

interface IObjectKeys {
    [key: string]: string;
}

export function diffToString(dateObj: DateObj) {
    const days: IObjectKeys = {
        0: "дней",
        1: "день",
        2: "дня",
        3: "дня",
        4: "дня",
        5: "дней",
        6: "дней",
        7: "дней",
        8: "дней",
        9: "дней",
    }
    const months: IObjectKeys = {
        0: "месяцев",
        1: "месяц",
        2: "месяца",
        3: "месяца",
        4: "месяца",
        5: "месяцев",
        6: "месяцев",
        7: "месяцев",
        8: "месяцев",
        9: "месяцев",
    }
    const years: IObjectKeys = {
        0: "лет",
        1: "год",
        2: "года",
        3: "года",
        4: "года",
        5: "лет",
        6: "лет",
        7: "лет",
        8: "лет",
        9: "лет",
    }

    let result = ""

    if (dateObj.years !== 0) {
        const yearsStr = String(dateObj.years)
        const last = yearsStr[yearsStr.length - 1]

        result += `${dateObj.years} ${years[last as keyof typeof years]} `
    }

    if (dateObj.months !== 0) {
        const monthsStr = String(dateObj.months)
        const last = +monthsStr[monthsStr.length - 1]

        result += `${dateObj.months} ${months[last as keyof typeof months]} `
    }

    if (dateObj.days !== 0) {
        const daysStr = String(dateObj.days)
        const last = daysStr[daysStr.length - 1]

        result += `${dateObj.days} ${days[last as keyof typeof days]} `
    }

    return result
}
