import { Link } from 'react-router-dom'
import styles from './FilterBar.module.scss'
import classNames from 'classnames/bind'
import { useEffect, useState } from 'react'
import { getAllSearch } from '~/api/api'

const cn = classNames.bind(styles)

function FilterBar() {
  const [filterItems, setFilterItems] = useState([])

  useEffect(() => {
    const getItems = async () => {
      const { data } = await getAllSearch()
      setFilterItems(data.result)
    }
    getItems()
  }, [])

  return (
    <div className={cn('filter-bar-box')}>
      {filterItems.map((item) => {
        return (
          <Link
            key={item._id}
            className={cn('filter-bar-link')}
            to={`/results?search_query=${item.content}`}
          >
            {item.content}
          </Link>
        )
      })}
    </div>
  )
}

export default FilterBar
