import React from 'react';
import moment from "moment";
import {Button, Card, Input, Space} from "antd";
import classNames from "classnames";
import {diffToString} from "../../helpers";
import { DatePicker } from 'antd';
import {PlusOutlined, MinusOutlined } from '@ant-design/icons';
import {ExperienceWork} from "../../interfaces/Resume";

const { RangePicker } = DatePicker

interface Props {
    workExp: Array<ExperienceWork>,
    setWorkExp: (state: (prev: ExperienceWork[]) => ExperienceWork[]) => any,
    formik: any,
    validateWorkExp: () => void,
    initialWorkExp: ExperienceWork,
    addRef: (el: any, fieldName: string, i: number) => void
}

const ExperienceWorkComponent = ({ workExp, setWorkExp, formik, validateWorkExp, initialWorkExp, addRef }: Props) => {
    const { errors, values, setFieldValue, setFieldError } = formik

    const companyHandler = (i: number) => (e: any) => {
        setWorkExp((prev) => {
            const newState = [...prev]
            newState[i].company = e.target.value
            return newState
        })
        setFieldValue(`experienceWork.${i}.company`, e.target.value)
        setFieldError(`experienceWork.${i}.company`, "")
    }

    const descrHandler = (i: number) => (e: any) => {
        setWorkExp((prev) => {
            const newState = [...prev]
            newState[i].descr = e.target.value
            return newState
        })
        setFieldValue(`experienceWork.${i}.descr`, e.target.value)
        setFieldError(`experienceWork.${i}.descr`, "")
    }

    const dateHandler = (i: number) => (date: any, dateString: Array<string>) => {
        setWorkExp((prev) => {
            const newState = [...prev]
            const [startTime, endTime] = dateString

            if (!dateString[0] || !dateString[1]) {
                newState[i] = {...newState[i], date: ["", ""]}
            } else {
                newState[i] = {...newState[i], date: [startTime, endTime]}
            }

            return newState
        })

        validateWorkExp()

        setFieldValue(`experienceWork.${i}.date`, dateString)

        setFieldError(`experienceWork.${i}.date`, "")
        setFieldError(`experienceWork.${i}.error`, "")
    }

    const getDiffBetweenDates = (startDate: object | string, endDate: object | string) => {
        const m1 = moment(startDate, "YYYY-MM-DD")
        const m2 = moment(endDate, "YYYY-MM-DD")
        // @ts-ignore
        return moment.preciseDiff(m1, m2, true)
    }

    return (
        <Space size={10} direction="vertical">
            <span>Опыт работы</span>
            {workExp.map((item, i: number) => {
                const [startTime, endTime] = workExp[i].date
                const diff = getDiffBetweenDates(startTime, endTime)

                return (
                    <Space key={i}>
                        <Card>
                            <Space size={10} direction="vertical">
                                <label>
                                    <Space size={2} direction="vertical">
                                        <span>Название компании</span>
                                        <Input
                                            ref={(el) => addRef(el, "company", i)}
                                            className={classNames({
                                                "error-input": errors.experienceWork &&
                                                    errors.experienceWork[i] &&
                                                    errors.experienceWork[i].company
                                            })}
                                            size="large"
                                            type="text"
                                            placeholder="Название"
                                            name={`experienceWork.${i}.company`}
                                            value={values.experienceWork[i].company}
                                            onChange={companyHandler(i)}
                                        />
                                    </Space>
                                </label>
                                {errors.experienceWork &&
                                errors.experienceWork[i] &&
                                errors.experienceWork[i].company ?
                                    <div>{errors.experienceWork[i].company}</div>: null}
                                <label>
                                    <Space size={2} direction="vertical">
                                        <span>Описание</span>
                                        <Input
                                            ref={(el: Input) => addRef(el, "descr", i)}
                                            className={classNames({
                                                "error-input": errors.experienceWork &&
                                                    errors.experienceWork[i] &&
                                                    errors.experienceWork[i].descr
                                            })}
                                            size="large"
                                            type="text"
                                            placeholder="Описание"
                                            name={`experienceWork.${i}.descr`}
                                            value={values.experienceWork[i].descr}
                                            onChange={descrHandler(i)}
                                        />
                                    </Space>
                                </label>
                                {errors.experienceWork &&
                                errors.experienceWork[i] &&
                                errors.experienceWork[i].descr ?
                                    <div>{errors.experienceWork[i].descr}</div>: null}
                                <label>
                                    <Space size={2} direction="vertical">
                                        <span>Время работы</span>
                                        <RangePicker
                                            ref={(el) => addRef(el, "date", i)}
                                            className={classNames({
                                                "error-input": (
                                                    errors.experienceWork &&
                                                    errors.experienceWork[i] &&
                                                    (errors.experienceWork[i].date || errors.experienceWork[i].error)
                                                )
                                            })}
                                            size="large"
                                            value={startTime && endTime ?
                                                [moment(startTime), moment(endTime)] :
                                                [null, null]}
                                            placeholder={["Дата начала", "Дата окончания"]}
                                            onChange={dateHandler(i)}
                                            disabledDate={(current: any) => {
                                                if (i > 0) {
                                                    const prevItem = workExp[i - 1]
                                                    const prevEndTime = prevItem.date[1]

                                                    return current && current < moment(prevEndTime).endOf('day')
                                                }
                                            }}
                                        />
                                    </Space>
                                </label>
                                {workExp[i].date[0] && workExp[i].date[1] ?
                                    <div>
                                        {diffToString(diff)}
                                    </div> : null}

                                {errors.experienceWork &&
                                errors.experienceWork[i] &&
                                errors.experienceWork[i].date ?
                                    <div>{errors.experienceWork[i].date}</div>: null}

                                {errors.experienceWork &&
                                errors.experienceWork[i] &&
                                errors.experienceWork[i].error ?
                                    <div>{errors.experienceWork[i].error}</div>: null}
                            </Space>
                        </Card>
                        {i !== 0 ?
                            <Button
                                size="small"
                                danger
                                type="primary"
                                icon={<MinusOutlined />}
                                onClick={() => {
                                    setWorkExp((prev) => prev.filter((stateItem, stateI: number) => i !== stateI))

                                    validateWorkExp()
                                }}
                            /> : null}
                    </Space>
                )
            })}
            <Button
                size="large"
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                    setWorkExp((prev) => {
                        const newState = [...prev]
                        newState.push({...initialWorkExp})
                        setFieldValue("experienceWork", newState)

                        return newState
                    })
                }}
            />
        </Space>
    );
}

export default ExperienceWorkComponent;
