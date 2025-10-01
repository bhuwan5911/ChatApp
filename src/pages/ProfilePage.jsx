import React from 'react'
import { useNavigate } from 'react-router-dom'

const ProfilePage = () => {

const [selectImg, setSelectedImg] = useState(null)
const navigate = useNavigate();
const [name, setName] = useState("Pradyun Sandhu")
const [bio , setBio] = useState("Hi , I am using QuickChat")

const handleSubmit = async (e) => {
    e.preventDefault();
    navigate('/')
}



  return (
    <div className='min-h-scrren bg-cover bg-no-repeat flex items-center
    justify-center'>
        <div className='w-5/6 max-w-3xl backdrop-blur-2xl text-gray-300 border-2
        border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg'>
            <form  onsubmit={handleSubmit}className="flex flex-col gap-5 p-10 flex-1">
                <h3 className="text-lg">Profile details</h3>
                <label htmlFor="avatar" className='flex items-center gap-3
                cursor-pointer'>
                    <input onChange={(e)=> setSelectedImg(e.target.files[0])} type="file" id='avatar' accept='.png, .jpg, .jpeg' hidden />
                    <img src={""} alt="" />
                    </label>
            </form>
            <img src={selectImg ? URL.createObjectURL(selectImg) : assets.
            avatar_icon} alt="" className={`w-12 h-12 ${selectImg && 
                'rounded-full'}`}/>
                upload profile picture

                </label>
                <input onChange={(e)=> setName(e.target.value)} value={name}
                type="text" required placeholder='Your name' className='p-2 border
                border-gray-500 rounded-md focus:outline-none focus:ring-2
                focus:ring-violet-500'/>'

                <textarea onChange={(e)=> setBio(e.target.value)} value={bio}
                placeholder="Write profile bio" required className="p-2 border
                border-gray-500 rounded-md focus:outline-none focus:ring-2
                focus:ring-violet-500" rows={4}></textarea>"

                <button type='submit' className='bg-gradient-to-r from-purple-400
                to-violet-600 text-white p-2 rounded-full text-lg cursor-pointer">Save</
                button>

                </form>
                <img className="max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10'
                src={assets.logo_icon} alt=""/>
        </div>
     
    </div>
  )
}

export default ProfilePage
