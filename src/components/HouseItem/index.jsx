import React from 'react'
import styles from './index.module.css'
function HouseItem({ houseImg, title, desc, tags, price }) {
    return (
        <div className={styles.house}>
            <div className={styles.imgWrap}>
                <img
                    className={styles.img}
                    src={houseImg}
                    alt=""
                />
            </div>
            <div className={styles.content}>
                <h3 className={styles.title}>{title}</h3>
                <div className={styles.desc}>{desc}</div>
                <div>
                    {tags.map(tag => (
                        <span
                            className={[styles.tag, styles.tag1].join(' ')}
                            key={tag}
                        >
                            {tag}
                        </span>
                    ))}
                </div>
                <div className={styles.price}>
                    <span className={styles.priceNum}>{price}</span> 元/月
                    </div>
            </div>
        </div>
    )
}

export default HouseItem