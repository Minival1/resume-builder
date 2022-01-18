export interface ExperienceWork {
    date: string[] | object[],
    company: string,
    descr: string,
    error: string
}

export interface Resume {
    avatar: {
        name: string
    },
    fullName: string,
    phone: string,
    experienceWork: Array<ExperienceWork>
}
