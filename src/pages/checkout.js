import {selectableData} from "@/data/selectableConfig";
import {modelInfo} from "@/data/modelInfo";
import {initialData} from "@/data/initialConfig";
import {useEffect, useState} from "react";
import {getUniData} from "@/pages/api/checkout";

export async function getServerSideProps(context) {
    return {
        props: {
            selectables: selectableData,
            modelInfo: modelInfo,
            initialData: initialData,
        }
    }
}

export default function Checkout(data) {
    const [configuration, setConfiguration] = useState(null);
    const [openedState, setOpenedState] = useState(data.selectables.componentCategories.map(() => false));

    useEffect(() => {
        const res = fetch('/api/checkout')
            .then((res) => res.json())
            .then(data => setConfiguration(data));
    })

    if(configuration=== null) return <></>;

    if(Object.keys(configuration).length===0) return <div>Please configure your car first <a href="/">Back to Home</a></div>;

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    console.log(openedState)

    let sum = data.modelInfo.priceInformation.price;
    configuration.equipmentAdded.forEach(eq => sum += eq.priceInformation.price);

    const handleOpenToggle = (e, category) => {
        e.preventDefault();
        setOpenedState(openedState.map((bool, index) => {
                return index ===
                data.selectables.componentCategories.findIndex(
                    el => el.categoryId === category.categoryId
                )
                    ? !bool : bool;
            }
        ))
    }

    return (
        <>
            <div>
                <h1 style={{textAlign: "center"}}>Confirmation page</h1>
                <h2>{data.modelInfo.name} <span
                    style={{float: "right"}}>Final Price: {formatter.format(sum)}  </span>
                </h2>

                {data.selectables.componentCategories.map(category =>
                    <>
                        <br/>
                        <h2 onClick={(e) => handleOpenToggle(e, category)}
                            style={{borderTop: "1px solid"}}>
                            {category.categoryName}
                            <span
                                style={{float: "right"}}>{openedState[data.selectables.componentCategories.findIndex(el => el.categoryId === category.categoryId)] ? "X" : "↓"}</span>
                        </h2>

                        {openedState[
                                data.selectables.componentCategories.findIndex(
                                    el => el.categoryId === category.categoryId)
                                ] &&
                            <>
                                {Object.entries(data.selectables.vehicleComponents).map(code =>
                                    <>
                                        {code[1].componentType === category.categoryName &&
                                            !code[1].hidden && !code[1].pseudoCode && code[1].selected &&
                                            configuration.equipmentRemoved.findIndex(el => el.id === code[0]) < 0 &&
                                            <div style={{borderBottom: "1px solid"}}>
                                                <br/>
                                                <b>{code[0]}</b>
                                                - {code[1].name}
                                                <div style={{float: "right"}}>
                                                    <b>{formatter.format(code[1].priceInformation.price)}</b>
                                                </div>

                                            </div>
                                        }
                                    </>)}
                                {configuration.equipmentAdded.map(eq =>
                                    <>
                                        {eq.componentType === category.categoryName &&
                                            <div style={{borderBottom: "1px solid", color: "green"}}>
                                                <br/>
                                                <b>+</b>
                                                <b>{eq.id}</b>
                                                - {eq.name}
                                                <div style={{float: "right"}}>
                                                    <b>{formatter.format(eq.priceInformation.netPrice)}</b>
                                                </div>

                                            </div>
                                        }
                                    </>)}

                            </>}
                    </>)}
                <br/>
                <br/><br/><br/><br/>
            </div>

        </>
    );
}
