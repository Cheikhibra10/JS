import { cardModel } from "../../data";
import "./CardComponent.css";
interface Props{
    data:cardModel
}
export default function CardComponent({data}:Props){
 return(
    <div className="stat-card rounded-lg p-6 text-white h-40">
    <div className="flex items-center mb-4">
      <div className="stat-icon w-12 h-12 rounded-full flex items-center justify-center mr-4">
        <i className={data.icon}></i>
      </div>
      <h3 className="text-base font-semibold">{data.text}</h3>
    </div>
    <p className="text-lg font-bold mb-2">{data.stat}</p>
    <div className="flex items-center text-sm">
      <i className="fas fa-arrow-up mr-1 text-green-400"></i>
      <span className="text-green-400">{data.pourcents}</span>
      <span className="ml-2 text-gray-300">{data.description}</span>
    </div>
  </div>
 )
}