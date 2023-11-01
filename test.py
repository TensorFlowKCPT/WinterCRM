import xml.etree.ElementTree as ET
from Database import Database
pars = '''<div class="schedule aleksandr">
        <h1>Александр</h1>
        <h2>Ноябрь</h2>
        <table id="november_2023">
            <tbody><tr>
                <td class="cell" style="background-color: blue;">1</td>
                <td class="cell">2</td>
                <td class="cell" style="background-color: blue;">3</td>
                <td class="cell" style="background-color: red;">4</td>
                <td class="cell">5</td>
                <td class="cell">6</td>
                <td class="cell">7</td>
            </tr>
            <tr>
                <td class="cell" style="background-color: red;">8</td>
                <td class="cell">9</td>
                <td class="cell" style="background-color: blue;">10</td>
                <td class="cell">11</td>
                <td class="cell">12</td>
                <td class="cell" style="background-color: red;">13</td>
                <td class="cell">14</td>
            </tr>
            <tr>
                <td class="cell">15</td>
                <td class="cell" style="background-color: blue;">16</td>
                <td class="cell">17</td>
                <td class="cell" style="background-color: blue;">18</td>
                <td class="cell">19</td>
                <td class="cell">20</td>
                <td class="cell" style="background-color: green;">21</td>
            </tr>
            <tr>
                <td class="cell" style="background-color: blue;">22</td>
                <td class="cell">23</td>
                <td class="cell">24</td>
                <td class="cell" style="background-color: blue;">25</td>
                <td class="cell" style="background-color: green;">26</td>
                <td class="cell" style="background-color: red;">27</td>
                <td class="cell" style="background-color: red;">28</td>
            </tr>
            <tr>
                <td class="cell">29</td>
                <td class="cell">30</td>
            </tr>
        </tbody></table>
        <h2>Декабрь</h2>
        <table id="december_2023">
            <tbody><tr>
                <td class="cell" style="background-color: blue;">1</td>
                <td class="cell">2</td>
                <td class="cell" style="background-color: blue;">3</td>
                <td class="cell">4</td>
                <td class="cell">5</td>
                <td class="cell">6</td>
                <td class="cell" style="background-color: blue;">7</td>
            </tr>
            <tr>
                <td class="cell">8</td>
                <td class="cell" style="background-color: red;">9</td>
                <td class="cell" style="background-color: blue;">10</td>
                <td class="cell" style="background-color: red;">11</td>
                <td class="cell">12</td>
                <td class="cell">13</td>
                <td class="cell">14</td>
            </tr>
            <tr>
                <td class="cell">15</td>
                <td class="cell">16</td>
                <td class="cell">17</td>
                <td class="cell">18</td>
                <td class="cell" style="background-color: blue;">19</td>
                <td class="cell">20</td>
                <td class="cell">21</td>
            </tr>
            <tr>
                <td class="cell" style="background-color: blue;">22</td>
                <td class="cell" style="background-color: green;">23</td>
                <td class="cell">24</td>
                <td class="cell" style="background-color: red;">25</td>
                <td class="cell">26</td>
                <td class="cell">27</td>
                <td class="cell" style="background-color: blue;">28</td>
            </tr>
            <tr>
                <td class="cell">29</td>
                <td class="cell">30</td>
            </tr>
        </tbody></table>
    </div>'''



