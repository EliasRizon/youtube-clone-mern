import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames/bind'
import { useEffect, useState } from 'react'
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'
import { useDebounce } from 'use-debounce'
import { getSearchResult } from '~/api/api'
import { SearchIcon } from '../icons'
import SearchResult from '../SearchResult'
import styles from './SearchBar.module.scss'

const cn = classNames.bind(styles)

function SearchBar() {
  const [searchValue, setSearchValue] = useState('')
  const [searchResult, setSearchResult] = useState([])
  const [debouncedValue] = useDebounce(searchValue, 200)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (searchValue.length > 0) {
        e.target.blur()
        navigate({
          pathname: '/results',
          search: `?${createSearchParams({
            search_query: searchValue.trim(),
          })}`,
        })
      }
    }
  }

  useEffect(() => {
    const searchQuery = searchParams.get('search_query')
    if (searchQuery) {
      setSearchValue(searchQuery)
    }
  }, [searchParams])

  useEffect(() => {
    if (!debouncedValue.trim()) {
      setSearchResult([])
      return
    }

    if (debouncedValue.length > 0) {
      const getData = async () => {
        const result = await getSearchResult(debouncedValue.trim())
        setSearchResult(result.data)
      }
      getData()
    }
  }, [debouncedValue])

  return (
    <div className={cn('search-wrapper')}>
      <form className={cn('search-box')}>
        <div className={cn('search-box-icon')}>
          <SearchIcon height="22" />
        </div>

        <div className={cn('input-box')}>
          <input
            className={cn('search-input')}
            type="text"
            placeholder="Tìm kiếm"
            spellCheck={false}
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value)
            }}
            onKeyDown={handleKeyDown}
          />
          {searchValue.length > 0 && (
            <div
              className={cn('delete-input')}
              onMouseDown={() => {
                setSearchValue('')
              }}
            >
              <FontAwesomeIcon icon={faXmark} />
            </div>
          )}
        </div>

        {/* <div className={cn('searchbysound-icon')}>
          <SearchBySoundIcon height="22" />
        </div> */}

        {searchResult.length > 0 && (
          <div className={cn('search-result')}>
            {searchResult.map((item) => (
              <SearchResult
                key={item._id}
                content={item.content}
                setSearchValue={setSearchValue}
                navigate={navigate}
              />
            ))}
          </div>
        )}
      </form>
    </div>
  )
}

export default SearchBar
