import React from 'react';
import { getPagesArr } from '../../../utils/page';

const Pagination = ({totalPage, page, setPage}) => {
    let pagesArr = getPagesArr(totalPage);
    return (
        <div className='page__wrapper'>
  
        {pagesArr.map(p => 
          <span 
            key={p}  
            onClick={() => setPage(p)}
            className={page === p ? 'page page__current' : 'page'}>
            {p}
          </span>
        )}
      </div>
    );
};

export default Pagination;