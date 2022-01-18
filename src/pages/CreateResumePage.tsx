import React, {useEffect, useState} from 'react';
import {FieldArray, FormikProvider, useFormik} from "formik";
import * as Yup from 'yup';
import {SaveOutlined, UserOutlined, PhoneOutlined, PlusOutlined, MinusOutlined, UploadOutlined } from '@ant-design/icons';
import { DatePicker, Button, Row, Space, Input, Upload, Card } from 'antd';
import MaskedInput from 'antd-mask-input'
import classNames from "classnames";
import moment from "moment";

import {diffToString} from "../helpers/index";

import "moment-precise-range-plugin";
import 'moment/locale/ru';
import {useAppDispatch} from "../store/hooks";
import { addResume } from '../slices/resumesSlice';

const { RangePicker } = DatePicker

moment.locale("ru")

const CreateResumePage = () => {
    const initialWorkExp: any = {
        date: [],
        company: "",
        descr: "",
        error: ""
    }

    const [workExp, setWorkExp] = useState([{...initialWorkExp}])
    const [uploadError, setUploadError] = useState("")
    const [uploadImg, setUploadImg] = useState<any>(false)
    const dispatch = useAppDispatch()

    const formik = useFormik({
        initialValues: {
            avatar: {},
            fullName: "",
            phone: "",
            experienceWork: [{...initialWorkExp}]
        },
        validationSchema: Yup.object({
            avatar: Yup.object().test("avatar", "Загрузите фото", () => Boolean(uploadImg.type)).nullable(),
            fullName: Yup.string().required("Заполните поле ФИО"),
            phone: Yup.string().test("valid-phone", "Заполните телефон", (value: any) => {
                return validatePhone(value)
            }),
            experienceWork: Yup.array().of(
                Yup.object().shape({
                    company: Yup.string().required("Укажите название компании"),
                    descr: Yup.string().required("Заполните описание"),
                    date: Yup.array().compact().min(2, "Заполните дату"),
                    error: Yup.string().test("test-date",
                        "Дата окончания не может быть позже даты начала следующего места работы",
                        (val) => !val)
                })
            )
        }),
        onSubmit: (values) => {
            dispatch(addResume({
                ...values,
                avatar: {
                    name: uploadImg.name
                }
            }))
            setWorkExp([{...initialWorkExp}])
            setUploadImg(false)
            setUploadError("")

            const square = document.querySelectorAll('.avatar');
            square.forEach((img: any) => {
                img.src = "./no_image.jpg"
            })

            formik.resetForm()
        },
        validateOnChange: false,
        validateOnBlur: false
    }) as any

    const uploadProps = {
        beforeUpload: (file: any) => {

            if (file.type !== 'image/png' && file.type !== "image/jpeg") {
                setUploadError(`${file.name} должен быть png/jpg`)
                setUploadImg(false)

                return Upload.LIST_IGNORE
            }

            if (file.size / 1024 > 2000) {
                setUploadError(`Размер файла не должен превышать 2 мб.`)
                setUploadImg(false)

                return Upload.LIST_IGNORE
            }

            setUploadImg(file)
            formik.setFieldValue("avatar", file)
            setUploadError("")

            return false
        },
        onChange: (info: any) => {
            formik.setFieldError("avatar", "")

            const square = document.querySelectorAll('.avatar');
            square.forEach((img: any) => {
                img.src = URL.createObjectURL(info.file)
                img.onload = function () {
                    URL.revokeObjectURL(img.src)
                }
            })
        },
    }

    function validatePhone(value: string) {
        if (value) {
            const replaced = value.replace(/[+_\-()\s]/g, "")
            if (replaced.length === 11) {
                return true
            }
        }

        return false
    }

    const validateWorkExp = () => {
        setWorkExp((prev) => {
            const newState = prev.map((range, rangeIndex) => {
                if (rangeIndex !== prev.length - 1) {
                    const nextRange = prev[rangeIndex + 1]
                    const [startTime, endTime] = range.date
                    const [nextStartTime, nextEndTime] = nextRange.date

                    if (moment(endTime) > moment(nextStartTime)) {
                        return {...range, error: "Дата начала не может быть раньше даты окончания предыдущего места работы"}
                    }
                }
                return {...range, error: ""}
            })

            formik.setFieldValue("experienceWork", newState)

            return newState
        })
    }

    return (
        <div>
            <FormikProvider value={formik}>
            <form onSubmit={formik.handleSubmit}>
                <Space size="middle" direction="vertical">
                    <Row>
                        <div>
                            <Upload {...uploadProps} fileList={uploadImg ? [uploadImg] : []}>
                                <Button size="large" danger={Boolean(formik.errors.avatar || uploadError)} icon={<UploadOutlined />}>Загрузить аватар</Button>
                            </Upload>
                            {uploadError ?
                                <div>{uploadError}</div>
                                : null}
                            {formik.errors.avatar ?
                                <div>{formik.errors.avatar}</div>
                                : null}
                        </div>
                        <img className="avatar avatar-square" src="./no_image.jpg" alt=""/>
                        {uploadImg ?
                            <img className="avatar avatar-circle" src="#" alt=""/>
                            : null}
                    </Row>
                    <Row>
                        <Space size={2} direction="vertical">
                            <label>
                                <Space size={2} direction="vertical">
                                    <span>ФИО</span>
                                    <Input
                                        className={classNames({"error-input": formik.errors.fullName})}
                                        size="large"
                                        type="text"
                                        placeholder="Ваше ФИО"
                                        name="fullName"
                                        prefix={<UserOutlined />}
                                        value={formik.values.fullName}
                                        onChange={(e) => {
                                            formik.handleChange(e)
                                            formik.setFieldError("fullName", "")
                                        }}
                                    />
                                </Space>
                            </label>
                            {formik.errors.fullName ?
                                <div>{formik.errors.fullName}</div>
                                : null}
                        </Space>
                    </Row>
                    <Row>
                        <Space size={2} direction="vertical">
                            <label>
                                <Space size={2} direction="vertical">
                                    <span>Телефон</span>
                                    <MaskedInput
                                        className={classNames({"error-input": formik.errors.phone})}
                                        prefix={<PhoneOutlined />}
                                        size="large"
                                        mask="+7 (111)-11-11-111"
                                        name="phone"
                                        placeholder="+7"
                                        value={formik.values.phone}
                                        onChange={(e: any) => {
                                            formik.handleChange(e)
                                            formik.setFieldError("phone", "")
                                        }}
                                    />
                                </Space>
                            </label>
                            {formik.errors.phone ?
                                <div>{formik.errors.phone}</div>
                                : null}
                        </Space>
                    </Row>
                    <Row>
                        <FieldArray
                            name="experienceWork"
                            render={() => (
                                <Space size={10} direction="vertical">
                                    <span>Опыт работы</span>
                                    {workExp.map((item, i: number) => {
                                        {moment(workExp[i].date[0]).from(moment(workExp[i].date[1]), true)}
                                        const [startTime, endTime] = workExp[i].date
                                        const m1 = moment(startTime, "YYYY-MM-DD")
                                        const m2 = moment(endTime, "YYYY-MM-DD")
                                        // @ts-ignore
                                        const diff = moment.preciseDiff(m1, m2, true)

                                        return (
                                            <Space key={i}>
                                                <Card>
                                                    <Space size={10} direction="vertical">
                                                        <label>
                                                            <Space size={2} direction="vertical">
                                                                <span>Название компании</span>
                                                                <Input
                                                                    className={classNames({"error-input": formik.errors.experienceWork && formik.errors.experienceWork[i] && formik.errors.experienceWork[i].company})}
                                                                    size="large"
                                                                    type="text"
                                                                    placeholder="Название"
                                                                    name={`experienceWork.${i}.company`}
                                                                    value={formik.values.experienceWork[i].company}
                                                                    onChange={(e) => {
                                                                        setWorkExp((prev) => {
                                                                            const newState = [...prev]
                                                                            newState[i].company = e.target.value
                                                                            return newState
                                                                        })
                                                                        formik.setFieldValue(`experienceWork.${i}.company`, e.target.value)
                                                                        formik.setFieldError(`experienceWork.${i}.company`, "")
                                                                    }}
                                                                />
                                                            </Space>
                                                        </label>
                                                        {formik.errors.experienceWork &&
                                                        formik.errors.experienceWork[i] &&
                                                        formik.errors.experienceWork[i].company ?
                                                        <div>{formik.errors.experienceWork[i].company}</div>: null}
                                                        <label>
                                                            <Space size={2} direction="vertical">
                                                                <span>Описание</span>
                                                                <Input
                                                                    className={classNames({"error-input": formik.errors.experienceWork && formik.errors.experienceWork[i] && formik.errors.experienceWork[i].descr})}
                                                                    size="large"
                                                                    type="text"
                                                                    placeholder="Описание"
                                                                    name={`experienceWork.${i}.descr`}
                                                                    value={formik.values.experienceWork[i].descr}
                                                                    onChange={(e) => {
                                                                        setWorkExp((prev) => {
                                                                            const newState = [...prev]
                                                                            newState[i].descr = e.target.value
                                                                            return newState
                                                                        })
                                                                        formik.setFieldValue(`experienceWork.${i}.descr`, e.target.value)
                                                                        formik.setFieldError(`experienceWork.${i}.descr`, "")
                                                                    }}
                                                                />
                                                            </Space>
                                                        </label>
                                                        {formik.errors.experienceWork &&
                                                        formik.errors.experienceWork[i] &&
                                                        formik.errors.experienceWork[i].descr ?
                                                        <div>{formik.errors.experienceWork[i].descr}</div>: null}
                                                        <label>
                                                            <Space size={2} direction="vertical">
                                                                <span>Время работы</span>
                                                                <RangePicker
                                                                    className={classNames({"error-input": (formik.errors.experienceWork && formik.errors.experienceWork[i] && (formik.errors.experienceWork[i].date || formik.errors.experienceWork[i].error))})}
                                                                    size="large"
                                                                    value={startTime && endTime ?
                                                                        [moment(startTime), moment(endTime)] :
                                                                        [null, null]}
                                                                    placeholder={["Дата начала", "Дата окончания"]}
                                                                    onChange={(date, dateString: any) => {

                                                                        setWorkExp((prev): any => {
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

                                                                        formik.setFieldValue(`experienceWork.${i}.date`, dateString)

                                                                        formik.setFieldError(`experienceWork.${i}.date`, "")
                                                                        formik.setFieldError(`experienceWork.${i}.error`, "")
                                                                    }}
                                                                    disabledDate={(current: any) => {
                                                                        if (i > 0) {
                                                                            const prevItem = workExp[i - 1]
                                                                            const [prevStartTime, prevEndTime] = prevItem.date

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

                                                        {formik.errors.experienceWork &&
                                                        formik.errors.experienceWork[i] &&
                                                        formik.errors.experienceWork[i].date ?
                                                        <div>{formik.errors.experienceWork[i].date}</div>: null}

                                                        {formik.errors.experienceWork &&
                                                        formik.errors.experienceWork[i] &&
                                                        formik.errors.experienceWork[i].error ?
                                                            <div>{formik.errors.experienceWork[i].error}</div>: null}
                                                    </Space>
                                                </Card>
                                                {i !== 0 ?
                                                    <Button
                                                        size="small"
                                                        danger
                                                        type="primary"
                                                        icon={<MinusOutlined />}
                                                        onClick={() => {
                                                            setWorkExp((prev) => prev.filter((stateItem, stateI) => i !== stateI))

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
                                                newState.push({ ...initialWorkExp })
                                                formik.setFieldValue("experienceWork", newState)

                                                return newState
                                            })
                                        }}
                                    />
                                </Space>
                            )}
                        />
                    </Row>
                    <Row>
                        <Button danger
                                htmlType="submit"
                                type="ghost"
                                icon={<SaveOutlined />}
                                size="large"
                                onClick={() => {
                                }}>
                            Сохранить
                        </Button>
                    </Row>
                </Space>
            </form>
            </FormikProvider>
        </div>
    );
};

export default CreateResumePage;
