import React, {useEffect, useRef, useState} from 'react';
import {FieldArray, FormikProvider, useFormik} from "formik";
import * as Yup from 'yup';
import {SaveOutlined, UserOutlined, PhoneOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Row, Space, Input, Upload } from 'antd';
import MaskedInput from 'antd-mask-input'
import classNames from "classnames";
import moment from "moment";
import {ExperienceWork} from "../interfaces/Resume"

import "moment-precise-range-plugin";
import 'moment/locale/ru';
import {useAppDispatch} from "../store/hooks";
import { addResume } from '../slices/resumesSlice';
import ExperienceWorkComponent from "../components/ExperienceWork/ExperienceWork";

moment.locale("ru")

const CreateResumePage = () => {
    const initialWorkExp: ExperienceWork = {
        date: [],
        company: "",
        descr: "",
        error: ""
    }

    const [workExp, setWorkExp] = useState([{...initialWorkExp}])
    const [uploadError, setUploadError] = useState("")
    const [uploadImg, setUploadImg] = useState<any>(false)
    const [allErrors, setAllErrors] = useState(null)

    const previewImgSquare = useRef<any>(null)
    const previewImgCircle = useRef<any>(null)
    const nameRef = useRef<any>(null)
    const phoneRef = useRef<any>(null)
    const workExpRefs = useRef<any>([])

    const addRef = (el: any, fieldName: string, i: number) => {
        workExpRefs.current[i] = {
            ...workExpRefs.current[i],
            [fieldName]: el
        }
    }

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

            previewImgSquare.current.src = "./no_image.jpg"

            resetForm()
        },
        validateOnChange: false,
        validateOnBlur: false
    }) as any

    const {handleSubmit, errors, values, handleChange, setFieldValue, setFieldError, resetForm} = formik

    useEffect(() => {
        if (errors.fullName) {
            nameRef.current.focus()
        } else if (errors.phone) {
            phoneRef.current.focus()
        } else if (errors.experienceWork) {
            for (const [i, error] of errors.experienceWork.entries()) {
                if (error?.company) {
                    workExpRefs.current[i].company.focus()
                    break
                }
                if (error?.descr) {
                    workExpRefs.current[i].descr.focus()
                    break
                }
                if (error?.date) {
                    workExpRefs.current[i].date.focus()
                    break
                }
            }
        }
        // eslint-disable-next-line
    }, [allErrors])

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
            setFieldValue("avatar", file)
            setUploadError("")

            return false
        },
        onChange: (info: any) => {
            setFieldError("avatar", "")

            const imgSquare = previewImgSquare.current
            const imgCircle = previewImgCircle.current

            const objectFile = URL.createObjectURL(info.file)

            imgSquare.src = objectFile
            imgSquare.onload = function () {
                URL.revokeObjectURL(imgSquare)
            }

            imgCircle.src = objectFile
            imgCircle.onload = function () {
                URL.revokeObjectURL(imgCircle)
            }
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
                    const endTime = range.date[1]
                    const nextStartTime = nextRange.date[0]

                    if (moment(endTime) > moment(nextStartTime)) {
                        return {...range, error: "Дата начала не может быть раньше даты окончания предыдущего места работы"}
                    }
                }
                return {...range, error: ""}
            })

            setFieldValue("experienceWork", newState)

            return newState
        })
    }

    const submit = (e: any) => {
        handleSubmit(e)
        setTimeout(() => {
            setAllErrors({...errors})
        }, 0)
    }

    return (
        <div>
            <FormikProvider value={formik}>
            <form onSubmit={submit}>
                <Space size="middle" direction="vertical">
                    <Row>
                        <div>
                            <Upload {...uploadProps} fileList={uploadImg ? [uploadImg] : []}>
                                <Button size="large"
                                        danger={Boolean(errors.avatar || uploadError)}
                                        icon={<UploadOutlined />}>Загрузить аватар</Button>
                            </Upload>
                            {uploadError ?
                                <div>{uploadError}</div>
                                : null}
                            {errors.avatar ?
                                <div>{errors.avatar}</div>
                                : null}
                        </div>
                        <img ref={previewImgSquare} className="avatar avatar-square" src="./no_image.jpg" alt=""/>
                        {uploadImg ?
                            <img ref={previewImgCircle} className="avatar avatar-circle" src="#" alt=""/>
                            : null}
                    </Row>
                    <Row>
                        <Space size={2} direction="vertical">
                            <label>
                                <Space size={2} direction="vertical">
                                    <span>ФИО</span>
                                    <Input
                                        ref={nameRef}
                                        className={classNames({"error-input": errors.fullName})}
                                        size="large"
                                        type="text"
                                        placeholder="Ваше ФИО"
                                        name="fullName"
                                        prefix={<UserOutlined />}
                                        value={values.fullName}
                                        onChange={(e) => {
                                            handleChange(e)
                                            setFieldError("fullName", "")
                                        }}
                                    />
                                </Space>
                            </label>
                            {errors.fullName ?
                                <div>{errors.fullName}</div>
                                : null}
                        </Space>
                    </Row>
                    <Row>
                        <Space size={2} direction="vertical">
                            <label>
                                <Space size={2} direction="vertical">
                                    <span>Телефон</span>
                                    <MaskedInput
                                        ref={phoneRef}
                                        className={classNames({"error-input": errors.phone})}
                                        prefix={<PhoneOutlined />}
                                        size="large"
                                        mask="+7 (111)-11-11-111"
                                        name="phone"
                                        placeholder="+7"
                                        value={values.phone}
                                        onChange={(e: any) => {
                                            handleChange(e)
                                            setFieldError("phone", "")
                                        }}
                                    />
                                </Space>
                            </label>
                            {errors.phone ?
                                <div>{errors.phone}</div>
                                : null}
                        </Space>
                    </Row>
                    <Row>
                        <FieldArray
                            name="experienceWork"
                            render={() => (
                               <ExperienceWorkComponent
                                    addRef={addRef}
                                    workExp={workExp}
                                    setWorkExp={setWorkExp}
                                    formik={formik}
                                    validateWorkExp={validateWorkExp}
                                    initialWorkExp={initialWorkExp}
                               />
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
