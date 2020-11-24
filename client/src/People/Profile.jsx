import { Divider } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';
import Title from '../ui/Title';


function Profile(props) {
    const { className } = props;

    const person = {
        username: 'pperic',
        registrationDate: '10.10.2020'
    }

    return (
        <div className={className}>
            <Title dark>
                {person.username}
            </Title>

            <Divider />
            <div className='profile-statistics'>
                balbl
                <div className='single-element'>
                    <span className='blocked highlighted'>1023</span>comments
                </div>
            </div>
        </div>
    );
}

export default styled(Profile)`
    padding: 8px;
    & .profile-statistics {
        .single-element {
            padding: 8px;
            border:1px solid #ccc;
            .blocked {
                display: block;
            }
            .highlighted {
                font-size: 1.5rem;
            }
            text-align: center;
        }
        border:1px solid #ccc;
    }
`;