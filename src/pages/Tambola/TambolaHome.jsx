import { useState } from 'react';
import io from 'socket.io-client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {  socket } from './socketconfig';
import Room from './Tambolaroom';
import Tambolaroom from './Tambolaroom'
import { BrowserRouter as Router, Route, Link, Switch, Redirect ,useRouteMatch, useHistory} from 'react-router-dom'
import {useDispatch} from 'react-redux'

const TambolaHome = () => {
    toast.configure();
    const {path}  = useRouteMatch();
    const history = useHistory();
    const dispatch = useDispatch();
    const [roomid, setroomid] = useState('');
    const [message, setmessage] = useState("");
    const [roomtype, setroomtype] = useState('');
    const [roomamount , setroomamount] = useState('');
    const [name ,setname]= useState('');
    socket.once('connect', () => {
        console.log("connected to server");
    })

    socket.on("tambolarandomeno",(obj)=>{
        toast("numbet is generated by the user ");
    })
    
    socket.once("tambolamessage", (obj) => {
        setmessage(obj.message)
        toast(obj.message)
    })
    function createroom(e) {
        e.preventDefault() 
      socket.emit("tambolacreateroom", name,roomtype, roomamount );
      socket.once("restambolacreateroom", (obj) => {
          if(obj.err== 0){
            toast(obj.message);
            dispatch({type:"SETUSER", data: obj.data})
            history.push(`/tambola/${obj.data.roomid}/${obj.data.name}`);
          }
          else{
              toast(obj.message);
          }
        

    })
    
     
    }
    function joinroom(e) {
        e.preventDefault() 
        console.log("forntend join requst is made ");
        socket.emit("tambolajoinroom",{name, roomid});
        socket.once("restambolajoinroom", (obj) => {
            console.log("join room accepted   ",obj);
            if(obj.err==0){
                dispatch({type:"SETUSER", data: obj.data})
            history.push(`/tambola/${obj.data.roomid}/${obj.data.name}`);
            toast(obj.message);
            }
            else{
                toast(obj.message);
            }

        })
        
    }
    function playonline() {
        socket.emit("tambolaplayonline")
    }


    return (
            <div className="Tambola">   
                <div className="container ">
                    <div className="row">
                        <div className="col-md-4">
                            <h1 className="text-center text-dark">Online Tambola game </h1>
                            <h1>the username of the page</h1>
                            <input type="text" value={name}  onChange={(e)=> setname(e.target.value)}/>
                            <form onSubmit={joinroom}>
                                <h1>join room</h1>
                                <input type="text" value={roomid} onChange={(e)=>setroomid(e.target.value)} />
                                <button type="submit" className="btn btn-primary">join room </button>
                            </form>
                        </div>
                        <div className="col-md-4" onSubmit={createroom}>
                            <form>
                                <h1>create room</h1>
                                <label htmlFor=""  className="w-100">select game type</label>
                                <select className="w-100" onChange={(e)=> setroomtype(e.target.value)}>
                                    <option value="2"> two player</option>
                                    <option value="4">four player </option>
                                    
                                </select>
                                <br/>
                                <label htmlFor="">Enter the  roomamount</label>
                                <input type="number" value={roomamount} onChange={(e)=>setroomamount(e.target.value)}/>
                                <button className="btn btn-primary" type="submit">create own room</button>   
                            </form>

                        </div>
                        <div className="col-md-4">
                            <button className="btn btn-primary">play online </button>
                        </div>


                    </div>
                </div>
            </div>
    )
}
export default TambolaHome
