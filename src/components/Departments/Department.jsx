import { Formik, Form, Field } from 'formik'
import React, { useEffect, useState } from 'react'
import { IoMdAdd } from 'react-icons/io'
import { BiSearchAlt } from 'react-icons/bi'
import { FiEdit } from 'react-icons/fi'
import { AiOutlineArrowLeft } from 'react-icons/ai'
import './Department.css'
import { Modal } from 'react-bootstrap'
import * as Yup from 'yup';
import { createDepartment } from '../API/Request/Department/createDepartment'
import { ToastContainer, toast } from 'react-toastify'
import { getAllDepartment } from '../API/Request/Department/getAllDepartments'
import { getDepartmentById } from '../API/Request/Department/getDepartmentById'
import { editDepartment } from '../API/Request/Department/editDepartment'

const ValidateDepartmentModal = Yup.object().shape({
    DepartmentName: Yup.string()
        .required('Please enter department name.'),
    DepartmentHead: Yup.string()
        .required('Please enter department head.'),
    Phone: Yup.string()
        .matches(/^\d{10}$/, 'Phone number must be digits')
        .required('Please enter phone no.'),
});

const Department = () => {
    const [departments, setDepartments] = useState([]);
    const [totalDepartments, setTotalDepartments] = useState('');
    const [isEdit, setIsEdit] = useState(false);
    const [editData, setEditData] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const HideModal = () => {
        setIsModalOpen(false);
    }
    const ShowModal = () => {
        setIsModalOpen(true);
    }

    const HandleSubmit = async (values) => {
        if (isEdit) {
            await editDepartment(values)
                .then(data => {
                    GetAllDepartment();
                    setIsEdit(false);
                    HideModal();
                    toast.success('Department updated successfully.')
                })
                .catch(err => {
                    if (err.response && err.response.status === 500) {
                        toast.error('Something went wrong')
                    }
                    else {

                    }

                })
        } else {
            await createDepartment(values)
                .then(data => {
                    GetAllDepartment();
                    HideModal();
                    toast.success("Department created successfully.");
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }



    const GetDepartmentById = async (Id) => {
        try {
            setIsEdit(true);
            const data = await getDepartmentById(Id);
            setEditData(data);
            ShowModal();
        }
        catch (err) {
            if (err.response && err.response.status === 500) {
                toast.error('No Department found.')
                HideModal();
                setIsEdit(false);
            }
        }
    }

    const GetAllDepartment = async () => {
        debugger;
        await getAllDepartment()
            .then(data => {
                setDepartments(data);
                setTotalDepartments('');
            })
            .catch(err => {
                if (err.response && err.response.status === 500) {
                    setTotalDepartments("No Departments found..")
                } else {
                    console.log("server error....");
                }
            })
    }

    useEffect(() => {
        (async () => {
            await GetAllDepartment();
        })();
    }, [])

    return (
        <div className='col-md 1 m-0 p-0'>
            <ToastContainer />
            <div className='bg-light p-3'>
                <div className='row'>
                    <div className='col-md'>
                        <h5>Departments</h5>
                    </div>
                    <div className='col-md d-flex justify-content-end mx-4'>
                        <link ></link> <AiOutlineArrowLeft className='back__arrow' />
                    </div>
                </div>
            </div>
            <div className='department__list mx-4 my-4'>
                <div className='row search__department'>
                    <div className='col-md-4'>
                        <form action="" className="search__form__container"  >
                            <BiSearchAlt />
                            <input type="search" className="form-control search__form" placeholder="search departments" />
                        </form>
                    </div>
                    <div className='col-md d-flex justify-content-end'>
                        <button className='btn btn-success' title='Add Organization' onClick={() => { ShowModal() }}><IoMdAdd className='mx-1' /></button>
                    </div>
                </div>
                <div className='department__table my-3'>
                    <table className='table table-hover'>
                        <thead>
                            <tr>
                                <th>SN</th>
                                <th>Department Name</th>
                                <th>Department Head</th>
                                <th>Phone</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                departments.map((eachDepartment, index) => {
                                    return (
                                        <tr key={eachDepartment.departmentId}>
                                            <td >{index + 1}</td>
                                            <td >{eachDepartment.departmentName}</td>
                                            <td >{eachDepartment.departmentHead}</td>
                                            <td >{eachDepartment.phone}</td>
                                            <td title='Edit Department' >
                                                <button onClick={() => {
                                                    GetDepartmentById(eachDepartment.departmentId)
                                                }}>
                                                    <FiEdit className='edit__icon' />
                                                </button>
                                            </td>
                                        </tr>
                                    )

                                })
                            }
                        </tbody>
                    </table>
                    {totalDepartments && <p className='text-center'>{totalDepartments}</p>}
                </div>
            </div>
            <Modal show={isModalOpen} className='department__modal'>
                <Modal.Header>
                    <Modal.Title>
                        Department
                    </Modal.Title>
                    <button type='button' className="btn-close" onClick={() => HideModal()}></button>
                </Modal.Header>
                <Formik
                    initialValues={
                        isEdit && editData
                            ? {
                                DepartmentName: editData.departmentName || '',
                                DepartmentHead: editData.departmentHead || '',
                                Phone: editData.phone || '',
                                DepartmentId: editData.departmentId || ''
                            } : {
                                DepartmentName: '',
                                DepartmentHead: '',
                                Phone: '',
                                LogoFile: '',
                            }
                    }
                    enableReinitialize={true}
                    validationSchema={ValidateDepartmentModal}
                    onSubmit={values => {
                        HandleSubmit(values)
                    }}
                >
                    {({ errors, touched, setFieldValue }) => (
                        <Form>
                            <Modal.Body>
                                <div className='row my-4'>
                                    <div className='col-md-6 col-sm-12'>
                                        <label className='form-label'>Department Name</label>
                                        <Field
                                            name='DepartmentName'
                                            className='form-control'
                                            type='text'
                                        />
                                        {errors.DepartmentName && touched.DepartmentName && <div className='text-danger text-start errors'>{errors.DepartmentName}</div>}
                                    </div>
                                    <div className='col-md-6 col-sm-12'>
                                        <label className='form-label'>Department Head</label>
                                        <Field
                                            name='DepartmentHead'
                                            className='form-control'
                                            type='text'
                                        />
                                        {errors.DepartmentHead && touched.DepartmentHead && <div className='text-danger text-start errors'>{errors.DepartmentHead}</div>}
                                    </div>
                                </div>
                                <div className='row  my-4'>
                                    <div className='col-md-6 col-sm-12'>
                                        <label className='form-label'>Phone</label>
                                        <Field
                                            name='Phone'
                                            className='form-control'
                                            type='number'
                                        />
                                        {errors.Phone && touched.Phone && <div className='text-danger text-start errors'>{errors.Phone}</div>}
                                    </div>
                                    <div className='col-md-6 col-sm-12'>
                                        <label className='form-label'>File</label>
                                        <input
                                            type="file"
                                            name="LogoFile"
                                            accept=".png,.jpg"
                                            onChange={(event) => {
                                                const file = event.target.files[0];
                                                setFieldValue('LogoFile', file);
                                            }}
                                        />
                                    </div>
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <input type="submit" className='btn btn-success' value='save' />
                            </Modal.Footer>
                        </Form>
                    )}
                </Formik>
            </Modal>
        </div>
    )
}
export default Department
