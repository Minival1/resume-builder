import React, {useEffect, useRef, useState} from 'react';
import {useFormik} from "formik";
import * as Yup from 'yup';
import { StringSchema, string, addMethod } from 'yup';
import {SaveOutlined, UserOutlined, PhoneOutlined, PlusOutlined, MinusOutlined, UploadOutlined } from '@ant-design/icons';
import { DatePicker, Button, Row, Space, Input, Upload, Card } from 'antd';
import MaskedInput from 'antd-mask-input'
import classNames from "classnames";
import moment from "moment";

const { RangePicker } = DatePicker;

function validatePhone(this: StringSchema, errorMessage: any) {
    return this.test(`test-phone`, errorMessage, function (value: any) {
        const { path, createError } = this;

        if (value) {
            const replaced = value.replace(/[+_\-()\s]/g, "")
            if (replaced.length === 11) {
                return true
            }
        }

        return createError({ path, message: errorMessage })
    });
}

addMethod(string, 'validatePhone', validatePhone)

const CreateResumePage = () => {
    const initialWorkExp = {
        start: "",
        end: "",
        company: "",
        descr: "",
        error: ""
    }
    const [workExp, setWorkExp] = useState([{...initialWorkExp}])
    const [uploadError, setUploadError] = useState("")
    const [uploadImg, setUploadImg] = useState<any>(false)

    const formik = useFormik({
        initialValues: {
            avatar: {},
            fullName: "",
            phone: "",
            experienceWork: []
        },
        validationSchema: Yup.object({
            avatar: Yup.object().test("avatar", "Загрузите фото", () => !uploadImg.type ? false : true).nullable(),
            fullName: Yup.string().required("Заполните поле ФИО"),
            phone: Yup.string().required("Заполните телефон").validatePhone("Заполните полностью телефон"),
            experienceWork: Yup.array().min(1, "Выберите дату").test("exp-work-valid", "Дата начала не может быть раньше даты окончания предыдущего места работы", () => {
                return !workExp.some((range: any) => {
                    if (range.error && range.error.length > 0) {
                        return true
                    }
                    return false
                })
            })
        } as any),
        onSubmit: (values) => {
        },
        validateOnChange: false,
        validateOnBlur: false
    })

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

    return (
        <div>
            <form onSubmit={formik.handleSubmit}>
                <Space size="middle" direction="vertical">
                    <Row>
                        <div>
                            <Upload {...uploadProps}>
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
                        <Space size={10} direction="vertical">
                            <span>Опыт работы</span>
                            {workExp.map((item, i: number) => {
                                return (
                                    <Space key={i}>
                                        <Card>
                                            <Space size={10} direction="vertical">
                                                <label>
                                                    <Space size={2} direction="vertical">
                                                        <span>Название компании</span>
                                                        <Input
                                                            className={classNames({"error-input": formik.errors.fullName})}
                                                            size="large"
                                                            type="text"
                                                            placeholder="Название"
                                                            name="fullName"
                                                            value={formik.values.fullName}
                                                            onChange={(e) => {
                                                                formik.handleChange(e)
                                                                formik.setFieldError("fullName", "")
                                                            }}
                                                        />
                                                    </Space>
                                                </label>
                                                <label>
                                                    <Space size={2} direction="vertical">
                                                        <span>Описание</span>
                                                        <Input
                                                            className={classNames({"error-input": formik.errors.fullName})}
                                                            size="large"
                                                            type="text"
                                                            placeholder="Описание"
                                                            name="fullName"
                                                            value={formik.values.fullName}
                                                            onChange={(e) => {
                                                                formik.handleChange(e)
                                                                formik.setFieldError("fullName", "")

                                                                console.log(formik)

                                                                // setWorkExp((prev): any => {
                                                                //     const newState = [...prev]
                                                                //     newState[i] = {...newState[i], start: dateString[0], end: dateString[1]}
                                                                //
                                                                //     formik.setFieldValue("experienceWork", newState)
                                                                //     formik.setFieldError("experienceWork", "")
                                                                //
                                                                //     return newState
                                                                // })
                                                                //
                                                                // setWorkExp((prev): any => {
                                                                //     return prev.map((range, rangeIndex) => {
                                                                //         if (rangeIndex !== prev.length - 1) {
                                                                //             const nextRange = prev[rangeIndex + 1]
                                                                //             if (moment(range.end) > moment(nextRange.start)) {
                                                                //                 return {...range, error: "Дата начала не может быть раньше даты окончания предыдущего места работы"}
                                                                //             }
                                                                //         }
                                                                //         return {...range, error: ""}
                                                                //     })
                                                                // })
                                                            }}
                                                        />
                                                    </Space>
                                                </label>
                                                <label>
                                                    <Space size={2} direction="vertical">
                                                        <span>Время работы</span>
                                                        <RangePicker
                                                            className={classNames({"error-input": formik.errors.experienceWork})}
                                                            size="large"
                                                            placeholder={["Дата начала", "Дата окончания"]}
                                                            onChange={(date, dateString: any) => {

                                                                setWorkExp((prev): any => {
                                                                    const newState = [...prev]
                                                                    newState[i] = {...newState[i], start: dateString[0], end: dateString[1]}

                                                                    formik.setFieldValue("experienceWork", newState)
                                                                    formik.setFieldError("experienceWork", "")

                                                                    return newState
                                                                })

                                                                setWorkExp((prev): any => {
                                                                    return prev.map((range, rangeIndex) => {
                                                                        if (rangeIndex !== prev.length - 1) {
                                                                            const nextRange = prev[rangeIndex + 1]
                                                                            if (moment(range.end) > moment(nextRange.start)) {
                                                                                return {...range, error: "Дата начала не может быть раньше даты окончания предыдущего места работы"}
                                                                            }
                                                                        }
                                                                        return {...range, error: ""}
                                                                    })
                                                                })
                                                            }}
                                                            disabledDate={(current: any) => {
                                                                if (i > 0) {
                                                                    const prevItem = workExp[i - 1]
                                                                    return current && current < moment(prevItem.end).endOf('day')
                                                                }
                                                            }}
                                                        />
                                                    </Space>
                                                </label>
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

                                                    setWorkExp((prev): any => {
                                                        return prev.map((range, rangeIndex) => {
                                                            if (rangeIndex !== prev.length - 1) {
                                                                const nextRange = prev[rangeIndex + 1]
                                                                if (moment(range.end) > moment(nextRange.start)) {
                                                                    return {...range, error: "Дата начала не может быть раньше даты окончания предыдущего места работы"}
                                                                }
                                                            }
                                                            return {...range, error: ""}
                                                        })
                                                    })
                                                }}
                                            /> : null}
                                    </Space>
                                )
                            })}
                            {formik.errors.experienceWork ?
                                <div>{formik.errors.experienceWork}</div>
                                : null}
                            <Button
                                size="large"
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => setWorkExp((prev) => [...prev, { ...initialWorkExp }])}
                            />
                        </Space>
                    </Row>
                    <Row>
                        <Button danger
                                htmlType="submit"
                                type="ghost"
                                icon={<SaveOutlined />}
                                size="large">
                            Сохранить
                        </Button>
                    </Row>
                </Space>
            </form>
        </div>
    );
};

export default CreateResumePage;
