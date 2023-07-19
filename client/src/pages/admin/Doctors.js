import React , {useEffect,useState} from 'react'
import Layout from './../../components/Layout';
import axios from 'axios';
import { Table, message } from 'antd';
import "../../styles/Heading.css"

const Doctors = () => {


  const [users , setUsers] = useState([]);
  const getUsers = async () =>{
         try { 
           const res = await axios.get('/api/v1/admin/getAllDoctors' , {
            headers:{
              Authorization: `Bearer ${localStorage.getItem('token')}`

            }
           })
                if(res.data.success){
                  setUsers(res.data.data);
                }

         } catch (error) {
          console.log(error);

         }
  }
  
  const handleAccountStatus = async(record, status) => {
          try {
             const res = await axios.post('/api/v1/admin/chnageAccountStatus' , 
             {doctorId: record._id , userId:record.userId , status:status}, {
                    headers:{
                      Authorization : `Bearer ${localStorage.getItem('token')}`
                    }
             })

             if(res.data.success){
              message.success(res.data.message);
              window.location.reload();
              
             }



          } catch (error) {
            message.error('Something Went Wrong');
          }

  }  
  useEffect(() => {
           getUsers();

  },[]);



  const columns = [
    {
      title : 'Name',
      dataIndex:'name',
      render:(text,record)=>(
        <span> {record.firstName} {record.lastName}</span>
      )

    },
    {
      title:'Status',
      dataIndex:'status'
    },
    {
      title:'Phone',
      dataIndex:'phone',
    
    },
    {
      title:'Actions',
      dataIndex:'actions',
      render : (text , record) => (
        <div className='d-flex'>
                 {record.status === "pending" ? <button className='btn btn-success' style={{backgroundColor:"green"}}  onClick={() => handleAccountStatus(record, "Approved")}>Approve</button> :
                 
                 <button className='btn btn-danger' style={{backgroundColor:"red"}} onClick={() => handleAccountStatus(record, "approved")}>Reject</button>
                 
                
                

                 }
        </div>
      ),
    },
  ];





  return (
         <Layout >
              <div className='image'>
                    

              <h1 className='heading'>All Doctors</h1>
              <Table  columns={columns}  dataSource={users}/>
              </div>  
         </Layout>
  )
}

export default Doctors;
