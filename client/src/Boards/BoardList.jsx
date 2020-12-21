import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import NavigationContext from '../contexts/NavigationContext';
import usePaging from '../hooks/usePaging';
import { boardsPagingSelector, sortBoardsSelectorOutput, boardSortChanged, boardsSortSelector} from '../slices/boardsSlice';
import Divider from '../ui/Divider';
import { StyledInput } from '../ui/FormikInput';
import ItemList from './BoardItemList';
import LinkText from '../ui/LinkText';
import { appName, fontSizeMd } from '../ui/uiSettings';

function BoardList(props) {

    document.title = `Boards - ${appName}`;

    const { className } = props;
    const [filter, setFilter] = useState('');
    const itemsPerPage = 10;
    const [page, changeCurrentPage] = usePaging('page');
    const boardSort = useSelector(boardsSortSelector);

    const { items: boards, totalAmountOfPages } = sortBoardsSelectorOutput(useSelector(state => (boardsPagingSelector(state, page, itemsPerPage, filter))), boardSort);
    const navContext = useContext(NavigationContext);
    const dispatch = useDispatch();

    useEffect(() => {
        navContext.setTitle(appName);
    });

    function handleFilterChange(evt) {
        setFilter(evt.target.value);
    }

    function handleSortChange(evt) {
        dispatch(boardSortChanged(evt.target.value));
    }


    return (
        <div className={className}>
            <div className='board-list-section'>
                <div className='flexed-title'>
                    <div className='action-control'>
                        Sort:
                        <StyledInput value={boardSort ?? ''} as='select' onChange={handleSortChange}>
                            <option value='none'>Default</option>
                            <option value='ascending'>Ascending</option>
                            <option value='descending'>Descending</option>
                        </StyledInput>
                    </div>
                    <div className='action-control'>
                        Search:
                        <StyledInput value={filter} onChange={handleFilterChange}></StyledInput>
                    </div>
                </div>
                <div className='right-aligned'>
                    <Link className='nav-link' to='/boards/new'>
                        New board...
                        </Link>
                </div>
                <Divider />
                <div className='content-section'>
                    <ItemList data={boards} />
                    <div className='activity-section'>
                    </div>
                </div>
                <div className='board-navigation'>
                    {page !== 1 && <LinkText onClick={() => changeCurrentPage(page - 1)}>Previous page...</LinkText>}
                    {page < totalAmountOfPages && <LinkText onClick={() => changeCurrentPage(page + 1)}>Next page...</LinkText>
                    }
                </div>
            </div>
        </div>
    );
}

export default styled(BoardList)`
    display: flex;
    justify-content: space-evenly;
    & > * {
        padding: 8px;
    }
    & > .board-list-section {
        flex-grow: 2;
    }
    & > .activity-section {
        flex-grow: .2;
    }
    & .content-section {
        display: flex;
        justify-content: space-around;

    }
    
    & .flexed-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    & .right-aligned {
        text-align: right;
    }
    & .nav-link {
        font-size: ${fontSizeMd};
    }
    & .action-control {
        font-size: ${fontSizeMd};
        width: 250px;
    }
    & .avatar-image {
        width: 20px;
        height: 20px;
        border:1px solid #ccc;
    }
    .activity-item-list {
        font-size: ${fontSizeMd};
        width: 250px;
        
    }
    .activity-item-list > * {
        margin: 8px 0;
    }
    .activity-item {
        display: flex;
    }
`;