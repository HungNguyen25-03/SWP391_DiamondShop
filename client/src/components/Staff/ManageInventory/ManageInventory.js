import React from 'react'
import './Inventory.scss'

export default function ManageInventory({ inventory }) {


    return (
        <>
            <table className='inventory'>
                <thead>
                    <tr>
                        <th>Product ID</th>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Category</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {inventory.map((invent, index) => (
                        <tr key={index}>
                            <td>{invent.proID}</td>
                            <td>{invent.proName}</td>
                            <td>{invent.price}</td>
                            <td>{invent.stock}</td>
                            <td>{invent.category}</td>
                            <td>
                                <button className="action-btn">▪▪▪</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}
